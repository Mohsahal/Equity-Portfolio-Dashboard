import { NextResponse } from "next/server";
import { initialPortfolio } from "@/data/portfolio";
import { fetchYahooCMP } from "@/lib/yahooFinance";
import { fetchGoogleFinanceMetrics } from "@/lib/googleFinance";
import {
  calculateStockMetrics,
  calculatePortfolioTotals,
  calculateSectorSummaries,
} from "@/lib/calculations";
import { Stock } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const enrichedStocks: Stock[] = await Promise.all(
      initialPortfolio.map(async (stock) => {
        const [liveCMP, googleMetrics] = await Promise.all([
          fetchYahooCMP(stock.ticker),
          fetchGoogleFinanceMetrics(stock.ticker),
        ]);

        return {
          ...stock,
          cmp: liveCMP ?? stock.cmp,
          peRatio: googleMetrics.peRatio ?? stock.peRatio,
          latestEarnings: googleMetrics.latestEarnings ?? stock.latestEarnings,
        };
      })
    );

    const calculatedStocks = calculateStockMetrics(enrichedStocks);
    const totals = calculatePortfolioTotals(calculatedStocks);
    const sectorSummaries = calculateSectorSummaries(calculatedStocks);

    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      totals,
      sectorSummaries,
      stocks: calculatedStocks,
    });
  } catch (error) {
    console.error("API error:", error);

    const fallback = calculateStockMetrics(initialPortfolio);
    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      isFallback: true,
      totals: calculatePortfolioTotals(fallback),
      sectorSummaries: calculateSectorSummaries(fallback),
      stocks: fallback,
    });
  }
}
