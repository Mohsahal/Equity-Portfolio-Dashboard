import {
  Stock,
  CalculatedStock,
  PortfolioTotals,
  SectorSummary,
} from "@/types/portfolio";

export function calculateStockMetrics(stocks: Stock[]): CalculatedStock[] {
  const totalPortfolioInvestment = stocks.reduce(
    (sum, stock) => sum + stock.purchasePrice * stock.quantity,
    0
  );

  return stocks.map((stock) => {
    const investment = stock.purchasePrice * stock.quantity;
    const presentValue = stock.cmp * stock.quantity;
    const gainLoss = presentValue - investment;

    const gainLossPercentage =
      investment > 0 ? (gainLoss / investment) * 100 : 0;

    const portfolioPercentage =
      totalPortfolioInvestment > 0
        ? (investment / totalPortfolioInvestment) * 100
        : 0;

    return {
      ...stock,
      investment,
      presentValue,
      gainLoss,
      gainLossPercentage,
      portfolioPercentage,
    };
  });
}

export function calculatePortfolioTotals(
  stocks: CalculatedStock[]
): PortfolioTotals {
  const totalInvestment = stocks.reduce((sum, s) => sum + s.investment, 0);
  const totalPresentValue = stocks.reduce((sum, s) => sum + s.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;

  const totalGainLossPercentage =
    totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercentage,
  };
}

export function calculateSectorSummaries(
  stocks: CalculatedStock[]
): SectorSummary[] {
  const groups: Record<string, CalculatedStock[]> = {};

  for (const stock of stocks) {
    if (!groups[stock.sector]) {
      groups[stock.sector] = [];
    }
    groups[stock.sector].push(stock);
  }

  return Object.entries(groups).map(([sector, sectorStocks]) => {
    const totalInvestment = sectorStocks.reduce(
      (sum, s) => sum + s.investment,
      0
    );
    const totalPresentValue = sectorStocks.reduce(
      (sum, s) => sum + s.presentValue,
      0
    );
    const totalGainLoss = totalPresentValue - totalInvestment;
    const gainLossPercentage =
      totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    return {
      sector,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      gainLossPercentage,
      stockCount: sectorStocks.length,
    };
  });
}
