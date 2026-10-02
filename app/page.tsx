"use client";

import { useState, useEffect } from "react";
import { initialPortfolio } from "@/data/portfolio";
import {
  calculateStockMetrics,
  calculatePortfolioTotals,
  calculateSectorSummaries,
} from "@/lib/calculations";
import {
  CalculatedStock,
  PortfolioTotals,
  SectorSummary as SectorSummaryType,
} from "@/types/portfolio";
import PortfolioTable from "@/components/PortfolioTable";
import SummaryCards from "@/components/SummaryCards";
import SectorSummary from "@/components/SectorSummary";

export default function HomePage() {
  const initialCalculated = calculateStockMetrics(initialPortfolio);
  const initialTotals = calculatePortfolioTotals(initialCalculated);
  const initialSectors = calculateSectorSummaries(initialCalculated);

  const [stocks, setStocks] = useState<CalculatedStock[]>(initialCalculated);
  const [totals, setTotals] = useState<PortfolioTotals>(initialTotals);
  const [sectorSummaries, setSectorSummaries] = useState<SectorSummaryType[]>(initialSectors);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setIsRefreshing(true);
      setError(null);

      const res = await fetch("/api/portfolio");
      if (!res.ok) {
        throw new Error("Failed to fetch live quotes");
      }

      const data = await res.json();
      if (data.success && data.stocks) {
        setStocks(data.stocks);
        setTotals(data.totals);
        setSectorSummaries(data.sectorSummaries);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading data";
      setError(message);
    } finally {
      setIsRefreshing(false);
      setCountdown(15);
    }
  }

  useEffect(() => {
    loadData();

    const intervalTimer = setInterval(() => {
      loadData();
    }, 15000);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 15));
    }, 1000);

    return () => {
      clearInterval(intervalTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="border-b border-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Equity Portfolio Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Live portfolio valuations with Yahoo Finance CMP and Google Finance fundamentals.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isRefreshing ? "bg-yellow-500 animate-ping" : "bg-green-500 animate-pulse"
              }`}
            ></span>
            <span>
              {isRefreshing ? "Updating prices..." : `Auto-refresh in ${countdown}s`}
            </span>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex justify-between items-center">
            <span>{error}. Displaying current portfolio.</span>
            <button
              onClick={() => loadData()}
              className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <SummaryCards totals={totals} stockCount={stocks.length} />

        <SectorSummary sectors={sectorSummaries} />

        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Holdings Breakdown by Sector
            </h2>
            <span className="text-xs text-gray-500">Prices in INR (₹)</span>
          </div>
          <PortfolioTable stocks={stocks} />
        </section>
      </div>
    </main>
  );
}
