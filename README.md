# PaisaPilot — Broke But Functional

A responsive financial decision-planning prototype for a ₹10,000, 30-day challenge.

## Features
- Balance, income, expenses, commitments, subscriptions and daily safe allowance
- Savings target and progress
- Unexpected expense simulation
- Purchase simulator with projected balance, daily allowance, health and risk
- 30-day balance chart
- Transaction add/delete and CSV export
- Responsive layout, keyboard focus styling, semantic forms and status announcements
- Unit tests for key financial calculations and transaction validation

## Project structure
- `index.html` — minimal app entry point
- `src/main.jsx` — React bootstrap
- `src/App.jsx` — app-level state and page composition
- `src/components/` — reusable UI components
- `src/data/` — demo seed data and challenge constants
- `src/utils/finance.js` — financial calculations and input validation
- `src/styles/` — global and application styles
- `src/utils/finance.test.js` — unit tests

## Run locally
Install Node.js LTS first, then run:

```bash
npm install
npm run dev
```

## Test and build
```bash
npm test
npm run build
```

## Deploy
Import the public GitHub repository into Vercel. Use Vite, build command `npm run build`, and output directory `dist`.

## Notes
This is a frontend prototype with demo data held in React state. It does not connect to banks or a database and data resets on refresh. Financial health and forecast values are illustrative estimates, not financial advice. Verify the test suite, build and live deployment before submitting.
