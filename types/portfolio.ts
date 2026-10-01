// 1. Raw Stock data structure
export interface Stock {
  id: string;
  name: string;           // Stock/Particulars (e.g., 'HDFC Bank')
  ticker: string;         // NSE/BSE Code (e.g., 'HDFCBANK', '532174')
  sector: string;         // Sector name (e.g., 'Financial Sector')
  purchasePrice: number;  // Purchase Price per share
  quantity: number;       // Number of shares owned
  cmp: number;            // Current Market Price
  peRatio: number | null; // P/E Ratio (null if not available)
  latestEarnings: number | null; // Latest Earnings / EPS (null if not available)
}

// 2. Stock with our calculated financial metrics
export interface CalculatedStock extends Stock {
  investment: number;          // Purchase Price × Quantity
  presentValue: number;        // CMP × Quantity
  gainLoss: number;            // Present Value - Investment
  gainLossPercentage: number;  // (GainLoss / Investment) × 100
  portfolioPercentage: number; // (Individual Investment / Total Investment) × 100
}

// 3. Sector summary totals
export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  stockCount: number;
}

// 4. Overall Portfolio Totals for Top Summary Cards
export interface PortfolioTotals {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}
