import React from 'react';
export default function PolicyStatus({ approved }) { return <span className={`policy-status ${approved ? 'approved' : ''}`}>{approved ? '✓ Policy approved' : 'Policy review'}</span>; }
