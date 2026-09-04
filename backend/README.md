# DealPilot backend

DealPilot is an AI-powered commerce backend where AI proposes, the deterministic Policy Engine decides, the customer approves, Razorpay executes, and audit records the state transitions.

## Architecture

Customer
↓
Express API
↓
AI Negotiator
↓
Policy Engine
↓
Customer Approval
↓
Razorpay
↓
Payment Verification
↓
Order + Audit
↓
Merchant Analytics

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Set `GEMINI_API_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` in `.env`. `RAZORPAY_WEBHOOK_SECRET` is required for verified webhooks. The server uses Razorpay Test Mode credentials and stores prototype records in `storage/*.json`.

## API

- `GET /` health check
- `GET /api/products` and `GET /api/products/:id` public catalog
- `POST /api/negotiate` AI proposal plus policy-safe offer
- `POST /api/offers/accept` revalidates customer acceptance
- `POST /api/create-order` validates amount and creates a Razorpay order
- `POST /api/payment/verify` verifies the Razorpay signature and creates an order record
- `POST /api/payment/webhook` verifies the raw Razorpay webhook signature and deduplicates event IDs
- `GET /api/audit?productId=&limit=` recent audit events
- `GET /api/analytics` calculated merchant metrics

## Negotiation and safety

Gemini receives the product and private merchant rules, but its JSON is never trusted for money actions. Every proposal is checked by `policyEngine.js`; invalid or too-low proposals receive a deterministic counter-offer. Customer acceptance has its own endpoint and is not inferred from AI output. Public product responses exclude minimum price, discount rules, and other merchant-private fields.

## Payments

Amounts in the API are rupees for compatibility with the existing frontend. The Razorpay service converts validated integer rupees to paise. Payment verification uses HMAC-SHA256 with `RAZORPAY_KEY_SECRET`; failed signatures never create paid orders. Webhooks require the `x-razorpay-signature` header and `RAZORPAY_WEBHOOK_SECRET`.

## Storage and analytics

Missing JSON collections are initialized automatically: orders, payments, negotiations, and audit logs. The storage service is intentionally small so it can later be replaced with a repository backed by MongoDB or PostgreSQL. Analytics derive revenue, negotiations, approvals, payment outcomes, and product performance from those records.

## Security notes

Keep `.env` out of source control. Never expose Razorpay secret or Gemini keys, and never return private merchant rules from catalog endpoints. Production deployments should add authentication, rate limiting, a real database, encrypted secrets, and a durable webhook idempotency store.
