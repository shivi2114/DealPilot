import React, { useState } from 'react';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function AIChat({
  product,
  messages = [],
  loading = false,
  error = '',
  offer = null,
  onSend,
  onClose,
  onAcceptOffer
}) {
  const [inputText, setInputText] = useState('');
  const [customBid, setCustomBid] = useState('');

  const handleSendText = (e) => {
    e.preventDefault();
    if (inputText.trim() && !loading) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const handleCustomBid = (e) => {
    e.preventDefault();
    const bidNumber = parseInt(customBid.replace(/[^0-9]/g, ''), 10);
    if (bidNumber && !loading) {
      onSend(`I would like to offer ₹${bidNumber} for this item.`);
      setCustomBid('');
    }
  };

  const quickPresets = [
    { label: 'Lowest best price', prompt: 'What is the absolute best price you can offer?' },
    { label: '5% off', prompt: `Can you do 5% off (around ${formatMoney(Math.round((product.price || product.originalPrice) * 0.95))})?` },
    { label: '10% off', prompt: `Can you do 10% off (around ${formatMoney(Math.round((product.price || product.originalPrice) * 0.90))})?` },
    { label: 'Free shipping', prompt: 'Can you include free delivery with this purchase?' },
    { label: 'Include accessory gift', prompt: 'Can you bundle a free gift or accessory with my order?' }
  ];

  return (
    <aside className="ai-negotiation-panel" aria-label="DealPilot Negotiation Console">
      <div className="ai-panel-header">
        <div className="agent-identity">
          <div className="agent-avatar">✦</div>
          <div>
            <div className="agent-title-row">
              <strong>DealPilot AI Negotiator</strong>
              <span className="live-status-pill">
                <i className="status-dot" /> Live
              </span>
            </div>
            <small>Representing {product.seller?.name || 'Verified Merchant'}</small>
          </div>
        </div>
        <button
          type="button"
          className="panel-close-btn"
          onClick={onClose}
          aria-label="Close negotiation window"
        >
          ✕
        </button>
      </div>

      <div className="negotiation-target-banner">
        <img src={product.image} alt={product.name} />
        <div className="target-details">
          <span className="target-name">{product.name}</span>
          <div className="target-prices">
            <span className="target-original">List: {formatMoney(product.price || product.originalPrice)}</span>
            {offer && (
              <span className="target-current-deal">
                Active Offer: <strong>{formatMoney(offer.offerPrice)}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="chat-messages-container" role="log" aria-live="polite">
        {messages.map((message, index) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={`${message.sender}-${index}-${message.time}`}
              className={`chat-bubble-row ${isUser ? 'user-row' : 'agent-row'}`}
            >
              {!isUser && <span className="bubble-avatar">DP</span>}
              <div className="bubble-content">
                <div className="bubble-text">{message.text}</div>
                <div className="bubble-meta">
                  <span>{isUser ? 'You' : 'DealPilot'}</span>
                  <span>{message.time}</span>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="chat-bubble-row agent-row">
            <span className="bubble-avatar">DP</span>
            <div className="bubble-content typing-box">
              <span className="evaluating-label">Evaluating merchant guardrails</span>
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error-banner" role="alert">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {offer && (
        <div className="embedded-offer-strip">
          <div className="strip-info">
            <span className="strip-badge">
              {offer.policyPassed ? '✓ Policy Approved Offer' : 'Merchant Counter-Offer'}
            </span>
            <div className="strip-pricing">
              <strong>{formatMoney(offer.offerPrice)}</strong>
              <small>Save {formatMoney(Math.max(0, (product.price || product.originalPrice) - offer.offerPrice))}</small>
            </div>
          </div>
          <button
            type="button"
            className="accept-strip-btn"
            onClick={() => onAcceptOffer(offer)}
          >
            Accept Deal <span>→</span>
          </button>
        </div>
      )}

      <div className="negotiation-controls">
        <form className="custom-bid-form" onSubmit={handleCustomBid}>
          <label htmlFor="custom-bid-input" className="bid-label">
            Make a price bid (₹):
          </label>
          <div className="bid-input-group">
            <span className="currency-prefix">₹</span>
            <input
              id="custom-bid-input"
              type="text"
              value={customBid}
              onChange={e => setCustomBid(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder={`e.g. ${Math.round((product.price || product.originalPrice) * 0.9)}`}
              disabled={loading}
              aria-label="Enter price bid in rupees"
            />
            <button
              type="submit"
              disabled={!customBid || loading}
              className="bid-submit-btn"
            >
              Propose Bid
            </button>
          </div>
        </form>

        <div className="quick-actions-carousel" aria-label="Quick negotiation shortcuts">
          {quickPresets.map(preset => (
            <button
              key={preset.label}
              type="button"
              className="quick-chip"
              onClick={() => onSend(preset.prompt)}
              disabled={loading}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form className="chat-input-bar" onSubmit={handleSendText}>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type your counteroffer or question..."
            disabled={loading}
            aria-label="Send custom message to DealPilot"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            aria-label="Send message"
            className="send-arrow-btn"
          >
            ↑
          </button>
        </form>

        <div className="guardrail-footer-note">
          <span className="shield-icon">🛡</span>
          <span>Merchant rules apply: deals are deterministic and protected by policy limits.</span>
        </div>
      </div>
    </aside>
  );
}
