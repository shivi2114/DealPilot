const { appendRecord, readCollection } = require("./storageService");

function recordAudit(event, productId, message, metadata = {}) {
  return appendRecord("auditLogs", { event, productId: productId || null, message, metadata, timestamp: new Date().toISOString() });
}
function recentAudit(productId, limit = 50) {
  const records = readCollection("auditLogs").filter(item => !productId || item.productId === productId);
  return records.slice(-Math.min(Math.max(Number(limit) || 50, 1), 200)).reverse();
}
module.exports = { recordAudit, recentAudit };
