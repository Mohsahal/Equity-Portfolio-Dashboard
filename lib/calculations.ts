import {
  Stock,
  CalculatedStock,
  PortfolioTotals,
  SectorSummary,
} from "@/types/portfolio";

export function calculateStockMetrics(stocks: Stock[]): CalculatedStock[] {
  let totalPortfolioInvestment = 0;
  for (const stock of stocks) {
    totalPortfolioInvestment += stock.purchasePrice * stock.quantity;
  }

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
  let totalInvestment = 0;
  let totalPresentValue = 0;

  for (const stock of stocks) {
    totalInvestment += stock.investment;
    totalPresentValue += stock.presentValue;
  }

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
  const groups: { [key: string]: CalculatedStock[] } = {};

  for (const stock of stocks) {
    if (!groups[stock.sector]) {
      groups[stock.sector] = [];
    }
    groups[stock.sector].push(stock);
  }

  const summaries: SectorSummary[] = [];

  for (const sector in groups) {
    const sectorStocks = groups[sector];
    let totalInvestment = 0;
    let totalPresentValue = 0;

    for (const s of sectorStocks) {
      totalInvestment += s.investment;
      totalPresentValue += s.presentValue;
    }

    const totalGainLoss = totalPresentValue - totalInvestment;
    const gainLossPercentage =
      totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    summaries.push({
      sector,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      gainLossPercentage,
      stockCount: sectorStocks.length,
    });
  }

  return summaries;
}
