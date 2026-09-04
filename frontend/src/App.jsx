import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import MerchantDashboard from './pages/MerchantDashboard';
import { categories, products } from './data/products';
import './App.css';

const API = 'http://localhost:5000/api';
const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const [view, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [offer, setOffer] = useState(null);
  const [negotiating, setNegotiating] = useState(false);
  const [negotiationError, setNegotiationError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const filteredProducts = useMemo(() => products.filter(product => (category === 'All' || product.category === category) && `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const savings = cart.reduce((sum, item) => sum + (item.product.price - (item.offer?.offerPrice || item.product.price)) * item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.offer?.offerPrice || item.product.price) * item.quantity, 0);
  const notify = message => { window.dispatchEvent(new CustomEvent('dealpilot-toast', { detail: message })); };
  const addToCart = product => { setCart(current => { const existing = current.find(item => item.product.id === product.id); return existing ? current.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }]; }); notify(`${product.name} added to your bag`); };
  const openProduct = product => { setSelectedProduct(product); setOffer(null); setChatOpen(false); setMessages([]); setView('product'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startNegotiation = product => { if (!product) return; openProduct(product); setChatOpen(true); setMessages([{ sender: 'ai', text: `Hi! I’m DealPilot. I’ll negotiate a better deal for ${product.name}. What would make this a great purchase for you?`, time: time() }]); };
  const sendMessage = async message => { if (message === '__open__') { setChatOpen(true); return; } if (!selectedProduct || negotiating) return; setChatOpen(true); setNegotiationError(''); setMessages(current => [...current, { sender: 'user', text: message, time: time() }]); setNegotiating(true); try { const response = await fetch(`${API}/negotiate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: selectedProduct.id, message }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Negotiation failed'); setMessages(current => [...current, { sender: 'ai', text: data.message, time: time() }]); if (typeof data.offerPrice === 'number') setOffer({ offerPrice: data.offerPrice, freeShipping: data.freeShipping, freeGift: data.freeGift, policyPassed: data.policyPassed, reason: data.reason }); } catch (error) { setNegotiationError(error.message || 'DealPilot is temporarily unavailable.'); } finally { setNegotiating(false); } };
  const acceptDeal = acceptedOffer => { if (!acceptedOffer) { setCart(current => { const existing = current.find(item => item.product.id === selectedProduct.id); return existing ? current : [...current, { product: selectedProduct, quantity: 1 }]; }); setChatOpen(false); setView('checkout'); return; } setCart(current => { const existing = current.find(item => item.product.id === selectedProduct.id); return existing ? current.map(item => item.product.id === selectedProduct.id ? { ...item, offer: acceptedOffer } : item) : [...current, { product: selectedProduct, quantity: 1, offer: acceptedOffer }]; }); setChatOpen(false); setView('checkout'); };
  const checkout = () => { setCartOpen(false); setPaymentError(''); setView('checkout'); };
  const pay = async () => { if (!cart.length || paymentLoading) return; setPaymentLoading(true); setPaymentError(''); try { const productId = cart.length === 1 ? cart[0].product.id : undefined; const response = await fetch(`${API}/create-order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: subtotal, productId }) }); const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.error || 'Unable to create payment order.'); if (!window.Razorpay) throw new Error('Razorpay Checkout has not loaded. Please refresh and try again.'); const primary = cart[0]; const razorpay = new window.Razorpay({ key: import.meta.env.VITE_RAZORPAY_KEY_ID, amount: data.amount, currency: data.currency, name: 'DealPilot', description: primary.product.name, order_id: data.orderId, prefill: { name: 'Alex Kumar', email: 'alex@example.com' }, theme: { color: '#6D4AFF' }, handler: () => { setOrder({ orderNumber: `DP-${Date.now().toString().slice(-8)}`, amount: subtotal, savings }); setView('success'); setCart([]); } }); razorpay.on('payment.failed', () => setPaymentError('Payment was not completed. No amount was charged.')); razorpay.open(); } catch (error) { setPaymentError(error.message || 'Payment could not be started.'); } finally { setPaymentLoading(false); } };
  const toggleWish = id => setWishlist(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const appProps = { wishlist, onWish: toggleWish, onOpen: openProduct, onAdd: addToCart, onNegotiate: startNegotiation };
  return <div className="app"><Navbar cartCount={cartCount} onCart={() => setCartOpen(true)} onMerchant={() => setView('merchant')} onShop={() => { setView('home'); setSelectedProduct(null); }} onSearch={() => document.querySelector('.search-bar input')?.focus()} />{view === 'home' && <Home {...appProps} search={search} setSearch={setSearch} category={category} setCategory={setCategory} categories={categories} filteredProducts={filteredProducts} />}{view === 'product' && selectedProduct && <ProductPage product={selectedProduct} offer={offer} messages={chatOpen ? messages : null} loading={negotiating} error={negotiationError} wished={wishlist.includes(selectedProduct.id)} onWish={toggleWish} onBack={() => setView('home')} onSend={sendMessage} onAccept={acceptDeal} onAdd={addToCart} onCloseChat={() => setChatOpen(false)} />}{view === 'checkout' && <CheckoutPage cart={cart} total={subtotal} savings={savings} onBack={() => setCartOpen(true)} onPay={pay} paymentLoading={paymentLoading} error={paymentError} />}{view === 'success' && order && <OrderSuccess order={order} onContinue={() => setView('home')} onOrders={() => notify('Your orders are coming soon')} />}{view === 'merchant' && <MerchantDashboard onBack={() => setView('home')} />}<Footer /><CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onQty={(id, delta) => setCart(current => current.map(item => item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))} onRemove={id => setCart(current => current.filter(item => item.product.id !== id))} onCheckout={checkout} onOptimize={() => notify('AI found ₹650 in potential bundle savings')} /></div>;
}
