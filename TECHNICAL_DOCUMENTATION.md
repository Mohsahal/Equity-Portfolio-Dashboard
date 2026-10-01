# Technical Documentation: Portfolio Dashboard

## 1. Overview & Architecture

The application is built using Next.js App Router. It combines a client-side dashboard with a server-side route handler to pull live market data from external financial sources.

- **Frontend (`app/page.tsx`):** A client component that manages portfolio state and triggers background polling every 15 seconds. It displays summary cards, a sector performance table, and a detailed holdings breakdown.
- **Backend Route (`app/api/portfolio/route.ts`):** A Node.js route handler that queries Yahoo Finance and Google Finance server-to-server, avoiding browser CORS restrictions.
- **Calculation Layer (`lib/calculations.ts`):** Pure calculation functions that compute investment amounts, present values, gains/losses, and percentages.
- **Data Source Modules (`lib/yahooFinance.ts`, `lib/googleFinance.ts`):** Small fetcher utilities responsible for fetching and parsing quotes from external endpoints.

## 2. Data Sources & Symbology

The dashboard uses three sources of data:
1. **Base Portfolio (`data/portfolio.ts`):** Purchase prices, quantities, sector assignments, and exchange symbols extracted from the provided Excel file.
2. **Yahoo Finance:** Used to retrieve the Current Market Price (CMP) via the chart endpoint (`/v8/finance/chart/{symbol}`).
3. **Google Finance:** Used to scrape the Price-to-Earnings (P/E) ratio and Earnings Per Share (EPS).

### Exchange Code Resolution
Indian equities trade on both the NSE and BSE. In the original spreadsheet, some stocks were referenced by their NSE ticker symbol (e.g., `HDFCBANK`, `BAJFINANCE`), while others used 6-digit BSE scrip codes (e.g., `532174` for ICICI Bank, `500400` for Tata Power).

To query Yahoo and Google Finance accurately:
- NSE symbols use the `.NS` suffix on Yahoo Finance (e.g., `HDFCBANK.NS`).
- BSE symbols use the `.BO` suffix or security code on Yahoo Finance.
- Google Finance uses `TICKER:EXCHANGE` format (e.g., `HDFCBANK:NSE`).
- A symbol mapping table resolves these codes to ensure valid queries.

## 3. API Limitations & Scraping Details

Neither service offers a public unauthenticated REST API for general use.

- **Yahoo Finance:** The `/v7/finance/quote` batch endpoint returns HTTP 401 without cookie/crumb sessions. The `/v8/finance/chart` endpoint remains accessible with standard browser headers and provides the current `regularMarketPrice`.
- **Google Finance:** Only HTML pages are returned. Class names in Google Finance are minified and subject to frequent automated changes. To prevent breakage, our parser matches semantic text labels (`P/E ratio` and `EPS`) rather than specific CSS class names.

## 4. Rate Limiting & Concurrency

- **Parallel Requests:** Fetching quotes for 26 stocks sequentially would create unacceptable latency (10-15 seconds). We use `Promise.all()` to dispatch requests concurrently, completing all fetches in approximately 1.5 seconds.
- **Timeouts:** Each outgoing request is bounded by a 4-second timeout using `AbortController` to prevent slow responses from blocking the application.
- **Graceful Fallbacks:** If an external endpoint times out or returns a rate limit (HTTP 429), the system uses the baseline data from `data/portfolio.ts` so the dashboard stays functional.

## 5. Calculations & Validation

The formulas implemented in `lib/calculations.ts` follow standard portfolio accounting:

- `Investment = Purchase Price * Quantity`
- `Present Value = CMP * Quantity`
- `Gain/Loss = Present Value - Investment`
- `Gain/Loss % = (Gain/Loss / Investment) * 100`
- `Portfolio % = (Individual Investment / Total Portfolio Investment) * 100`

### Sanity Checks
- Total portfolio investment sums to ₹15,43,060 across both the individual stock list and the sector groupings.
- The sum of all individual portfolio weights equals 100.00%.
- Division by zero checks ensure that stocks with zero investment do not produce `NaN` or `Infinity`.

## 6. Error Handling

- **Per-stock error handling:** If one stock fails to return live data, only that stock falls back to baseline data; the other 25 stocks continue updating normally.
- **Global error handling:** If the entire route fails, the server returns baseline data with `isFallback: true`.
- **UI states:** If a network failure occurs, the UI displays a dismissible alert banner with a Retry button without clearing currently displayed data.

## 7. Refresh Strategy

- An interval timer (`setInterval`) in `app/page.tsx` polls `/api/portfolio` every 15 seconds.
- A 1-second countdown ticker provides visual feedback to the user on when the next sync will occur.
- A cleanup function in `useEffect` clears the intervals on unmount to prevent memory leaks.
- During updates, a slim progress bar indicates network activity while keeping the table visible, avoiding layout shifts (CLS).

## 8. Summary of Technical Decisions

1. **Why Next.js Route Handlers instead of client-side fetch?** Browsers enforce CORS policies that block client-side JavaScript from reading responses from Yahoo or Google Finance. Running the fetch server-side bypasses CORS cleanly.
2. **Why HTTP polling instead of WebSockets?** Polling every 15 seconds is lightweight, stateless, and requires no specialized socket infrastructure.
3. **Why pre-parsed TypeScript data instead of parsing `.xlsx` at runtime?** Parsing binary Excel files in Node.js adds unnecessary runtime CPU overhead and large dependencies. Converting the static data to a TypeScript array provides instant loading and compile-time type validation.
