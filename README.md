# Subnado

One email field and one Run button. No account, categories or Subnado-generated email verification challenge.

## Run locally

Requires Node.js 22 or newer.

```sh
npm start
```

Open http://localhost:3000. Run the tests using `npm test`.

## Current functionality

The Run button sends the entered email to a same-origin server and displays a response with attempted, confirmed, pending, skipped and failed counts. No publisher integrations are configured, therefore **no newsletter signups are attempted**. Subnado never reports an unconfirmed signup as successful. The server does not send any verification emails.

## Integration policy

The single-click engine supports publisher-specific adapters only where authorisation of the recipient has already been established independently and the publisher permits the integration. Entering someone's email in the input field is not proof of authorisation. Do not add arbitrary-address registration endpoints, unsolicited bulk submissions, anti-bot evasion, CAPTCHA bypass or falsified success states. Integrations must support publisher rate limits, duplicate suppression and provider-required double opt-in. Automatic registration from arbitrary unverified addresses is intentionally unsupported.

## Deployment

This is an initial server-backed prototype, not a production-ready bulk registration service. Configure compatible, authorised publisher integrations, abuse controls, secure hosting and end-to-end tests before describing any real signup capability.
