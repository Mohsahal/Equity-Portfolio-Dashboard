# Dynamic Equity Portfolio Dashboard

A real-time equity portfolio tracking dashboard built with Next.js (App Router), TypeScript, and Tailwind CSS for the Octa Byte AI Full Stack Intern Assignment.

The application manages 26 stock holdings across 6 sectors, connects with Yahoo Finance and Google Finance for live market pricing, and auto-refreshes every 15 seconds.

## Features

- **Live Market Data:**
  - CMP (Current Market Price) fetched from Yahoo Finance.
  - P/E Ratio and Latest Earnings (EPS) scraped from Google Finance.
- **Financial Calculations:**
  - Investment = Purchase Price × Quantity
  - Present Value = CMP × Quantity
  - Gain/Loss = Present Value - Investment
  - Gain/Loss % = (Gain/Loss / Investment) × 100
  - Portfolio % = (Individual Investment / Total Investment) × 100
- **Sector Breakdown:**
  - 6 sectors: Financial, Tech, Consumer, Power, Pipe, Others.
  - Sector-level totals for Investment, Present Value, and Gain/Loss with subtotals.
- **Visual Indicators:**
  - Green for positive returns, red for negative returns.
  - Top summary cards for quick asset overview.
- **Auto-Refresh & Reliability:**
  - 15-second background polling with a visual countdown ticker.
  - Fallback to base portfolio values if external endpoints are throttled.
- **Responsive Layout:**
  - Works on desktop, tablet, and mobile with horizontal scrolling on dense tables.

## Tech Stack

- **Framework:** Next.js (App Router, Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Runtime:** Node.js

## Project Structure

```text
├── app/
│   ├── api/
│   │   └── portfolio/
│   │       └── route.ts        # Server route for Yahoo & Google Finance aggregation
│   ├── globals.css             # Tailwind setup
│   ├── layout.tsx              # Page shell and metadata
│   └── page.tsx                # Dashboard client component
├── components/
│   ├── PortfolioTable.tsx      # Sector-grouped table with subtotals
│   ├── SectorSummary.tsx       # Sector summary breakdown
│   └── SummaryCards.tsx        # Top KPI metric cards
├── data/
│   └── portfolio.ts            # Base stock records extracted from Excel
├── lib/
│   ├── calculations.ts         # Math calculation functions
│   ├── googleFinance.ts        # Google Finance scraper
│   └── yahooFinance.ts         # Yahoo Finance CMP fetcher
└── types/
    └── portfolio.ts            # TypeScript interfaces
```

## Running Locally

1. Clone or open the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Route

- `GET /api/portfolio`: Returns the latest portfolio state, calculated metrics, and sector totals as JSON.
