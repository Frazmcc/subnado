# Subnado

One field. One Run button. No account or newsletter categories.

## Current status

The web frontend validates an email address and explains why registration cannot begin yet. **It does not submit, verify or subscribe any email address.** Opening this static page should never generate outgoing subscription requests.

## Intended production workflow

1. User enters an email address and presses Run.
2. Subnado sends a one-time ownership verification challenge via a configured transactional email service, protected by rate limits and abuse controls. No newsletter signup requests occur before verification.
3. When the address is verified, a server-side registration service considers consented publisher integrations only, honoring each publisher's policies and limits. Do not bypass CAPTCHA, double opt-in, or anti-bot mechanisms.
4. An idempotency key per email and publisher prevents duplicate attempts; retry with bounded backoff only where permitted.
5. The UI displays attempted, accepted-but-pending-confirmation, confirmed, skipped and failed separately. Never call accepted submissions confirmed without provider evidence.
6. No account creation or category selection is required. Give clear opt-out, data retention and privacy information.

## Running

Open `index.html` in a browser. Run checks using `node tests/smoke.test.cjs` (Node 22+).

## Deployment blockers

The application needs an email verification backend, a verified sending domain, a database or equivalent idempotency store, publisher-approved subscription integrations, and an end-to-end test environment. These have **not** been implemented yet.
