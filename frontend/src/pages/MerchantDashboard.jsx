import React, { useCallback, useEffect, useState } from 'react';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function MerchantDashboard({ onBack, apiBase = import.meta.env.VITE_API_URL || '/api' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshIndex, setRefreshIndex] = useState(0);

  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    setError('');
    setRefreshIndex(prev => prev + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      fetch(`${apiBase}/analytics`).then(res => {
        if (!res.ok) throw new Error('Analytics failed');
        return res.json();
      }),
      fetch(`${apiBase}/audit?limit=30`).then(res => {
        if (!res.ok) return { events: [] };
        return res.json();
      })
    ])
      .then(([analyticsData, auditData]) => {
        if (!ignore) {
          setAnalytics(analyticsData);
          setAuditLogs(auditData.events || []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!ignore) {
          console.error('Merchant dashboard error:', err);
          setError('Could not connect to DealPilot backend service. Showing cached merchant guardrails.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [apiBase, refreshIndex]);

  const kpis = [
    {
      title: 'Total Store Revenue',
      value: analytics ? formatMoney(analytics.revenue) : '₹0',
      sub: `${analytics?.successfulDeals || 0} verified orders`,
      trend: 'Verified Razorpay'
    },
    {
      title: 'AI-Attributed Revenue',
      value: analytics ? formatMoney(analytics.aiAttributedRevenue) : '₹0',
      sub: `${analytics?.approvedOffers || 0} policy-approved deals`,
      trend: 'Negotiated'
    },
    {
      title: 'Total Negotiations',
      value: analytics ? analytics.negotiations.toString() : '0',
      sub: `${analytics?.conversionRate || 0}% deal conversion`,
      trend: 'Active'
    },
    {
      title: 'Avg. Buyer Savings',
      value: analytics ? formatMoney(analytics.averageSavings) : '₹0',
      sub: 'Within safe margins',
      trend: 'Win-win'
    }
  ];

  return (
    <main className="merchant-dashboard-container">
      <div className="dashboard-top-bar">
        <div>
          <button
            type="button"
            className="back-btn-pill"
            onClick={onBack}
            aria-label="Back to storefront"
          >
            ← Return to Storefront
          </button>
          <div className="merchant-welcome">
            <span className="welcome-eyebrow">MERCHANT WORKSPACE & TELEMETRY</span>
            <h1 className="merchant-title">Northstar Goods Command Center</h1>
            <p className="merchant-subtitle">
              Monitor real-time AI negotiations, verify deterministic policy enforcement, and track sales revenue.
            </p>
          </div>
        </div>

        <div className="dashboard-actions-row">
          <button
            type="button"
            className="secondary-button refresh-btn"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '↻ Refresh Telemetry'}
          </button>
        </div>
      </div>

      {error && (
        <div className="dashboard-warning-strip" role="alert">
          <span className="warning-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-tab-navigation" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`dash-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Performance Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'products'}
          className={`dash-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Breakdown
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'audit'}
          className={`dash-tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Trail ({auditLogs.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'policies'}
          className={`dash-tab ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          Pricing Guardrails
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        {kpis.map(kpi => (
          <div key={kpi.title} className="kpi-card">
            <span className="kpi-title">{kpi.title}</span>
            <strong className="kpi-value">{kpi.value}</strong>
            <div className="kpi-footer">
              <span className="kpi-sub">{kpi.sub}</span>
              <span className="kpi-trend-pill">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="dashboard-two-col-layout">
          {/* Top Products Table */}
          <section className="dash-panel product-metrics-panel">
            <div className="dash-panel-header">
              <div>
                <span className="panel-eyebrow">CONVERSION BY ITEM</span>
                <h3 className="panel-heading">Product Negotiation Metrics</h3>
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="merchant-data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Negotiations</th>
                    <th>Approved</th>
                    <th>Verified Sales</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.negotiationsByProduct?.length ? (
                    analytics.negotiationsByProduct.map(row => (
                      <tr key={row.productId}>
                        <td className="product-col-cell">
                          <strong>{row.product}</strong>
                          <small className="product-id-sub">ID: {row.productId}</small>
                        </td>
                        <td>{row.negotiations}</td>
                        <td>
                          <span className="approved-count-tag">{row.approvedOffers}</span>
                        </td>
                        <td>{row.sales}</td>
                        <td className="revenue-col-cell">{formatMoney(row.revenue)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="empty-table-cell">
                        No product negotiation metrics recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Real-time AI Activity Feed */}
          <aside className="dash-panel live-activity-panel">
            <div className="dash-panel-header">
              <div>
                <span className="panel-eyebrow">COMPLIANCE & ACTIVITY</span>
                <h3 className="panel-heading">Recent AI Engine Events</h3>
              </div>
              <span className="live-indicator-tag">
                <i className="pulse-dot green" /> Live
              </span>
            </div>

            <div className="activity-event-stream">
              {auditLogs.slice(0, 8).map((event, idx) => {
                const isApproved = event.event === 'POLICY_APPROVED' || event.event === 'CUSTOMER_ACCEPTED' || event.event === 'PAYMENT_VERIFIED';
                const isRejected = event.event === 'POLICY_REJECTED' || event.event === 'PAYMENT_FAILED';

                return (
                  <div key={`${event.timestamp}-${idx}`} className="activity-event-item">
                    <span className={`event-marker-dot ${isApproved ? 'green' : isRejected ? 'red' : 'purple'}`} />
                    <div className="event-details">
                      <div className="event-header-line">
                        <strong className="event-name">{event.event}</strong>
                        <span className="event-time">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="event-desc">{event.details || event.reason || 'Event processed by DealPilot'}</p>
                      {event.productId && (
                        <span className="event-product-pill">Item: {event.productId}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Tab 2: Detailed Products Breakdown */}
      {activeTab === 'products' && (
        <section className="dash-panel">
          <div className="dash-panel-header">
            <div>
              <span className="panel-eyebrow">CATALOG PERFORMANCE</span>
              <h3 className="panel-heading">All Negotiable Inventory</h3>
            </div>
          </div>

          <div className="table-responsive-wrapper">
            <table className="merchant-data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product ID</th>
                  <th>Total Inquiries</th>
                  <th>Approved Deals</th>
                  <th>Orders Converted</th>
                  <th>Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.negotiationsByProduct?.map(item => (
                  <tr key={item.productId}>
                    <td><strong>{item.product}</strong></td>
                    <td><code>{item.productId}</code></td>
                    <td>{item.negotiations}</td>
                    <td><span className="tag-green">{item.approvedOffers}</span></td>
                    <td><strong>{item.sales}</strong></td>
                    <td><strong>{formatMoney(item.revenue)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 3: Complete Audit Trail */}
      {activeTab === 'audit' && (
        <section className="dash-panel">
          <div className="dash-panel-header">
            <div>
              <span className="panel-eyebrow">SYSTEM OF RECORD</span>
              <h3 className="panel-heading">Deterministic Audit Trail</h3>
              <p className="panel-sub">Every AI negotiation proposal, policy evaluation, customer acceptance, and payment verification is cryptographically logged.</p>
            </div>
          </div>

          <div className="table-responsive-wrapper">
            <table className="merchant-data-table audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Event Type</th>
                  <th>Product</th>
                  <th>Details & Audit Context</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={`${log.timestamp}-${i}`}>
                    <td className="timestamp-cell">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`event-pill-badge ${log.event.toLowerCase()}`}>
                        {log.event}
                      </span>
                    </td>
                    <td><code>{log.productId || 'store'}</code></td>
                    <td className="details-cell">{log.details || log.reason || JSON.stringify(log.metadata || {})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 4: Pricing Guardrails */}
      {activeTab === 'policies' && (
        <section className="dash-panel">
          <div className="dash-panel-header">
            <div>
              <span className="panel-eyebrow">AUTOMATED PRICING CONTROLS</span>
              <h3 className="panel-heading">Active Negotiation Guardrails</h3>
              <p className="panel-sub">
                The DealPilot Policy Engine enforces these deterministic limits. AI agents are never allowed to exceed these discount bounds or offer unauthorized free gifts.
              </p>
            </div>
          </div>

          <div className="policies-grid">
            <div className="policy-rule-card">
              <span className="rule-badge">PRICE FLOOR PROTECTION</span>
              <h4>Minimum Price Caps</h4>
              <p>Each inventory item has a non-negotiable floor price. Any buyer bid lower than the floor triggers an automated deterministic counteroffer.</p>
              <div className="rule-status active">✓ Active & Enforced</div>
            </div>

            <div className="policy-rule-card">
              <span className="rule-badge">MARGIN SAFEGUARD</span>
              <h4>Max Discount Cap (14% - 16%)</h4>
              <p>Discounts are strictly limited per item category so that seller unit economics and profit margins remain protected.</p>
              <div className="rule-status active">✓ Active & Enforced</div>
            </div>

            <div className="policy-rule-card">
              <span className="rule-badge">PERKS PERMISSION</span>
              <h4>Authorized Bundle Gifts</h4>
              <p>Only pre-approved perks (e.g. Carrying Case, Extra Straps, Mouse Grip Tape) can be offered to close deals.</p>
              <div className="rule-status active">✓ Active & Enforced</div>
            </div>

            <div className="policy-rule-card">
              <span className="rule-badge">PAYMENT RECONCILIATION</span>
              <h4>Razorpay Signature Verification</h4>
              <p>Orders are marked verified only after HMAC-SHA256 signature verification succeeds against Razorpay payment secrets.</p>
              <div className="rule-status active">✓ Active & Enforced</div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
