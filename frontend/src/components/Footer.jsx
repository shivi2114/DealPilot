import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-mark">DP</span>
            <strong>Deal<span>Pilot</span></strong>
          </div>
          <p className="footer-tagline">
            The direct bargaining platform where buyers discover premium products and negotiate prices with merchant-backed AI guardrails.
          </p>
          <div className="footer-trust-marks">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>🛡 Razorpay Verified</span>
            <span>✓ 7-Day Returns</span>
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Platform</span>
          <ul className="footer-nav-list">
            <li><a href="#shop">Explore Catalog</a></li>
            <li><a href="#how-it-works">How Bargaining Works</a></li>
            <li><a href="#shop">Buyer Guarantee</a></li>
            <li><a href="#shop">Verified Merchants</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Compliance & Security</span>
          <ul className="footer-nav-list">
            <li><span>Deterministic Policy Engine</span></li>
            <li><span>Cryptographic Audit Logging</span></li>
            <li><span>Zero Bait-and-Switch Pricing</span></li>
            <li><span>Merchant Margin Protection</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Support & Trust</span>
          <ul className="footer-nav-list">
            <li><span>support@dealpilot.internal</span></li>
            <li><span>Dispute Resolution</span></li>
            <li><span>Merchant Onboarding</span></li>
            <li><span>Terms of Service & Privacy</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <small>© 2026 DealPilot Commerce Inc. All rights reserved.</small>
        <small className="footer-disclaimer">
          DealPilot enforces automated price guardrails authorized by verified merchants. All negotiated deals are binding for the active checkout session.
        </small>
      </div>
    </footer>
  );
}
