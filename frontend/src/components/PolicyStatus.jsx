import React from 'react';

export default function PolicyStatus({ approved, reason }) {
  return (
    <div className={`policy-status-badge ${approved ? 'approved' : 'counter'}`}>
      <span className="status-icon">{approved ? '✓' : '✦'}</span>
      <span className="status-text">{approved ? 'Policy Approved' : 'Merchant Counteroffer'}</span>
      {reason && <span className="status-note">({reason})</span>}
    </div>
  );
}
