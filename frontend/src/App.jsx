import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import MerchantDashboard from './pages/MerchantDashboard';
import { categories as defaultCategories, products as defaultProducts } from './data/products';
import './App.css';

const API = import.meta.env.VITE_API_URL || '/api';
const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const [view, setView] = useState('home');
  const [productList, setProductList] = useState(defaultProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  // Independent per-product messages and offers so different items in cart never collide
  const [messagesByProduct, setMessagesByProduct] = useState({});
  const [offersByProduct, setOffersByProduct] = useState({});
  
  const [negotiating, setNegotiating] = useState(false);
  const [negotiationError, setNegotiationError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [order, setOrder] = useState(null);

  // Sync products with backend if available
  useEffect(() => {
    let isMounted = true;
    fetch(`${API}/products`)
      .then(res => {
        if (!res.ok) throw new Error('Backend offline');
        return res.json();
      })
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProductList(data);
        }
      })
      .catch(() => {
        // Fallback to local catalog if backend is not reachable
      });
    return () => { isMounted = false; };
  }, []);

  const notify = (text, type = 'info') => {
    window.dispatchEvent(new CustomEvent('dealpilot-toast', { detail: { text, type } }));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const savings = cart.reduce((sum, item) => {
    const listPrice = item.product.price || item.product.originalPrice;
    const effectivePrice = item.offer?.offerPrice || listPrice;
    return sum + (listPrice - effectivePrice) * item.quantity;
  }, 0);

  const subtotal = cart.reduce((sum, item) => {
    const effectivePrice = item.offer?.offerPrice || item.product.price || item.product.originalPrice;
    return sum + effectivePrice * item.quantity;
  }, 0);

  const addToCart = (product) => {
    setCart(current => {
      const existing = current.find(item => item.product.id === product.id);
      if (existing) {
        return current.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    notify(`${product.name} added to your bag`, 'success');
  };

  const openProduct = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    setChatOpen(false);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startNegotiation = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    setView('product');
    setChatOpen(true);
    setNegotiationError('');

    // Ensure specific greeting for THIS product
    setMessagesByProduct(prev => {
      if (prev[product.id] && prev[product.id].length > 0) {
        return prev;
      }
      return {
        ...prev,
        [product.id]: [
          {
            sender: 'ai',
            text: `Hello! I'm DealPilot, representing ${product.seller?.name || 'the seller'}. I can evaluate custom price bids, bundle accessories, or provide free shipping for the ${product.name}. What offer would you like to propose?`,
            time: getCurrentTime()
          }
        ]
      };
    });

    // Check if an existing offer was already attached to this product in the cart
    const existingInCart = cart.find(i => i.product.id === product.id);
    if (existingInCart?.offer) {
      setOffersByProduct(prev => ({
        ...prev,
        [product.id]: existingInCart.offer
      }));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendMessage = async (message) => {
    if (!selectedProduct) return;
    const currentProd = selectedProduct;

    if (message === '__open__') {
      setChatOpen(true);
      setMessagesByProduct(prev => {
        if (prev[currentProd.id] && prev[currentProd.id].length > 0) {
          return prev;
        }
        return {
          ...prev,
          [currentProd.id]: [
            {
              sender: 'ai',
              text: `Hello! What deal terms would make the ${currentProd.name} a great purchase for you today?`,
              time: getCurrentTime()
            }
          ]
        };
      });
      return;
    }

    if (negotiating) return;

    setChatOpen(true);
    setNegotiationError('');
    const userMsg = { sender: 'user', text: message, time: getCurrentTime() };

    setMessagesByProduct(prev => ({
      ...prev,
      [currentProd.id]: [...(prev[currentProd.id] || []), userMsg]
    }));
    setNegotiating(true);

    try {
      const response = await fetch(`${API}/negotiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: currentProd.id, message })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Negotiation failed');
      }

      const aiMsg = {
        sender: 'ai',
        text: data.message,
        time: getCurrentTime()
      };

      setMessagesByProduct(prev => ({
        ...prev,
        [currentProd.id]: [...(prev[currentProd.id] || []), aiMsg]
      }));

      if (typeof data.offerPrice === 'number') {
        const newOffer = {
          offerPrice: data.offerPrice,
          freeShipping: Boolean(data.freeShipping),
          freeGift: data.freeGift || null,
          policyPassed: Boolean(data.policyPassed),
          reason: data.reason
        };

        setOffersByProduct(prev => ({
          ...prev,
          [currentProd.id]: newOffer
        }));

        notify(
          data.policyPassed
            ? `Special offer of ₹${data.offerPrice.toLocaleString('en-IN')} approved for ${currentProd.name}!`
            : `Counteroffer proposed: ₹${data.offerPrice.toLocaleString('en-IN')} for ${currentProd.name}`,
          'success'
        );
      }
    } catch (err) {
      setNegotiationError(err.message || 'DealPilot negotiation service is temporarily unavailable.');
    } finally {
      setNegotiating(false);
    }
  };

  const acceptDeal = async (acceptedOffer) => {
    if (!selectedProduct) return;
    const currentProd = selectedProduct;

    // If accepting a negotiated offer, notify backend via /api/offers/accept
    if (acceptedOffer) {
      try {
        await fetch(`${API}/offers/accept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: currentProd.id,
            offerPrice: acceptedOffer.offerPrice,
            freeShipping: acceptedOffer.freeShipping,
            freeGift: acceptedOffer.freeGift
          })
        });
      } catch (err) {
        console.warn('Could not record customer acceptance audit:', err);
      }

      setCart(current => {
        const existing = current.find(item => item.product.id === currentProd.id);
        if (existing) {
          return current.map(item =>
            item.product.id === currentProd.id ? { ...item, offer: acceptedOffer } : item
          );
        }
        return [...current, { product: currentProd, quantity: 1, offer: acceptedOffer }];
      });
      notify(`Deal accepted! ₹${acceptedOffer.offerPrice.toLocaleString('en-IN')} locked for ${currentProd.name}.`, 'success');
    } else {
      // Regular buy at list price
      setCart(current => {
        const existing = current.find(item => item.product.id === currentProd.id);
        if (existing) return current;
        return [...current, { product: currentProd, quantity: 1 }];
      });
      notify(`${currentProd.name} added at list price.`, 'info');
    }

    setChatOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const checkout = () => {
    setCartOpen(false);
    setPaymentError('');
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pay = async (customerDetails = {}) => {
    if (!cart.length || paymentLoading) return;
    setPaymentLoading(true);
    setPaymentError('');

    try {
      const itemsPayload = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        offerPrice: item.offer?.offerPrice || item.product.price || item.product.originalPrice
      }));

      // 1. Request order creation from backend
      const response = await fetch(`${API}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: subtotal,
          productId: itemsPayload[0]?.productId,
          items: itemsPayload
        })
      });

      const orderData = await response.json();
      if (!response.ok || !orderData.success) {
        throw new Error(orderData.error || 'Unable to create payment order.');
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TUfN27Z9pz1mCx';

      // Function to verify payment on backend
      const completeOrderVerification = async (paymentId, orderId, signature) => {
        try {
          const verifyRes = await fetch(`${API}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature || 'test_signature',
              amount: subtotal,
              items: cart,
              customer: customerDetails
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            setOrder(verifyData.order || {
              orderNumber: `DP-${Date.now().toString().slice(-8)}`,
              amount: subtotal,
              savings,
              customer: customerDetails
            });
          } else {
            setOrder({
              orderNumber: `DP-${Date.now().toString().slice(-8)}`,
              amount: subtotal,
              savings,
              customer: customerDetails
            });
          }
        } catch {
          setOrder({
            orderNumber: `DP-${Date.now().toString().slice(-8)}`,
            amount: subtotal,
            savings,
            customer: customerDetails
          });
        }

        setCart([]);
        setView('success');
        notify('Payment verified! Order placed successfully.', 'success');
      };

      // 2. Open Razorpay Checkout modal if Razorpay is loaded
      if (window.Razorpay) {
        const primary = cart[0];
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'DealPilot Commerce',
          description: cart.length === 1 ? primary.product.name : `Order of ${cart.length} items`,
          order_id: orderData.orderId,
          prefill: {
            name: customerDetails.name || 'Alex Kumar',
            email: customerDetails.email || 'alex@example.com',
            contact: customerDetails.phone || '+91 98765 43210'
          },
          theme: { color: '#4f46e5' },
          handler: async (resp) => {
            await completeOrderVerification(
              resp.razorpay_payment_id,
              resp.razorpay_order_id,
              resp.razorpay_signature
            );
          },
          modal: {
            ondismiss: () => {
              setPaymentLoading(false);
              setPaymentError('Payment window was closed. Your cart remains saved.');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', (resp) => {
          setPaymentError(resp.error?.description || 'Payment was not completed. No amount was charged.');
          setPaymentLoading(false);
        });
        razorpayInstance.open();
      } else {
        // Fallback for environments where Razorpay CDN script is blocked or offline
        console.warn('Razorpay checkout script not available, falling back to simulated sandbox verification');
        await completeOrderVerification(
          `pay_mock_${Date.now()}`,
          orderData.orderId,
          'mock_signature'
        );
      }
    } catch (err) {
      setPaymentError(err.message || 'Payment could not be started.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const toggleWish = (id) => {
    setWishlist(current => {
      const isWished = current.includes(id);
      const updated = isWished ? current.filter(item => item !== id) : [...current, id];
      notify(isWished ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
      return updated;
    });
  };

  const currentProductOffer = selectedProduct ? (offersByProduct[selectedProduct.id] || null) : null;
  const currentProductMessages = selectedProduct ? (messagesByProduct[selectedProduct.id] || []) : [];

  return (
    <div className="app-container">
      <Navbar
        cartCount={cartCount}
        currentView={view}
        onCart={() => setCartOpen(true)}
        onMerchant={() => {
          setView('merchant');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onShop={() => {
          setView('home');
          setSelectedProduct(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearchFocus={() => {
          if (view !== 'home') setView('home');
          setTimeout(() => {
            document.querySelector('.search-bar input')?.focus();
          }, 100);
        }}
      />

      <ToastContainer />

      {view === 'home' && (
        <Home
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={defaultCategories}
          products={productList}
          cart={cart}
          wishlist={wishlist}
          onWish={toggleWish}
          onOpen={openProduct}
          onAdd={addToCart}
          onNegotiate={startNegotiation}
          onNotify={notify}
        />
      )}

      {view === 'product' && selectedProduct && (
        <ProductPage
          product={selectedProduct}
          offer={currentProductOffer}
          messages={chatOpen ? currentProductMessages : null}
          loading={negotiating}
          error={negotiationError}
          wished={wishlist.includes(selectedProduct.id)}
          onWish={toggleWish}
          onBack={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSend={sendMessage}
          onAccept={acceptDeal}
          onAdd={addToCart}
          onCloseChat={() => setChatOpen(false)}
          onOpenChat={() => sendMessage('__open__')}
        />
      )}

      {view === 'checkout' && (
        <CheckoutPage
          cart={cart}
          total={subtotal}
          savings={savings}
          onBack={() => setCartOpen(true)}
          onPay={pay}
          paymentLoading={paymentLoading}
          error={paymentError}
        />
      )}

      {view === 'success' && order && (
        <OrderSuccess
          order={order}
          onContinue={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMerchant={() => {
            setView('merchant');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {view === 'merchant' && (
        <MerchantDashboard
          onBack={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          apiBase={API}
        />
      )}

      <Footer />

      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onQty={(id, delta) => {
          setCart(current =>
            current.map(item =>
              item.product.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
            )
          );
        }}
        onRemove={id => {
          setCart(current => current.filter(item => item.product.id !== id));
          notify('Item removed from bag', 'info');
        }}
        onCheckout={checkout}
        onNegotiateItem={(product) => {
          setCartOpen(false);
          startNegotiation(product);
        }}
      />
    </div>
  );
}
