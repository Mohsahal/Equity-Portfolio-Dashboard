"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [sectorSummaries, setSectorSummaries] =
    useState<SectorSummaryType[]>(initialSectors);
  const [lastUpdated, setLastUpdated] = useState<string>("Initializing...");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);

  const loadPortfolioData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setErrorMessage(null);

      const res = await fetch("/api/portfolio");
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.stocks) {
        setStocks(data.stocks);
        setTotals(data.totals);
        setSectorSummaries(data.sectorSummaries);
        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
        setIsFallbackMode(Boolean(data.isFallback));
      } else {
        throw new Error(data.error || "Unable to read portfolio payload");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setErrorMessage(`${msg}. Using currently loaded market data.`);
    } finally {
      setIsRefreshing(false);
      setCountdown(15);
    }
  }, []);

  useEffect(() => {
    loadPortfolioData();

    const intervalId = setInterval(() => {
      loadPortfolioData();
    }, 15000);

    const tickerId = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 15));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(tickerId);
    };
  }, [loadPortfolioData]);

  return (
    <main className="min-h-screen bg-gray-50/60 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="border-b border-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Equity Portfolio Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Live portfolio valuations with Yahoo Finance CMP and Google Finance fundamentals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3.5 py-1.5 shadow-xs text-xs font-medium text-gray-700">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isRefreshing
                    ? "bg-amber-500 animate-ping"
                    : "bg-emerald-500 animate-pulse"
                }`}
              ></span>
              <span>
                {isRefreshing
                  ? "Fetching latest quotes..."
                  : `Auto-refresh in ${countdown}s`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 shadow-xs text-xs font-medium text-gray-700">
              <span className="text-gray-400">🕒</span>
              <span>
                Synced: <strong className="text-gray-900">{lastUpdated}</strong>
              </span>
            </div>
          </div>
        </header>

        {isRefreshing && (
          <div className="w-full bg-blue-100 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-1 rounded-full animate-pulse w-full"></div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadPortfolioData()}
                className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs text-rose-600 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {isFallbackMode && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">ℹ️</span>
              <span>
                Market API rate limit encountered. Showing baseline valuations.
              </span>
            </div>
          </div>
        )}

        <SummaryCards totals={totals} stockCount={stocks.length} />
        <SectorSummary sectors={sectorSummaries} />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Holdings Breakdown by Sector
            </h2>
            <span className="text-xs text-gray-500">
              Prices in INR (₹) • Auto-refreshing every 15s
            </span>
          </div>
          <PortfolioTable stocks={stocks} />
        </section>
      </div>
    </main>
  );
}
