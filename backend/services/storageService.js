const fs = require("fs");
const path = require("path");

const storageDirectory = path.join(__dirname, "..", "storage");
const files = {
  orders: "orders.json",
  payments: "payments.json",
  negotiations: "negotiations.json",
  auditLogs: "auditLogs.json"
};

function ensureStorage() {
  fs.mkdirSync(storageDirectory, { recursive: true });
  Object.values(files).forEach(file => {
    const filePath = path.join(storageDirectory, file);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf8");
  });
}
function readCollection(name) { ensureStorage(); return JSON.parse(fs.readFileSync(path.join(storageDirectory, files[name]), "utf8")); }
function writeCollection(name, records) { ensureStorage(); fs.writeFileSync(path.join(storageDirectory, files[name]), JSON.stringify(records, null, 2), "utf8"); return records; }
function appendRecord(name, record) { const records = readCollection(name); records.push(record); return writeCollection(name, records); }
module.exports = { ensureStorage, readCollection, writeCollection, appendRecord };
