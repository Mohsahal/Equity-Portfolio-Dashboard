import React from "react";
import { CalculatedStock } from "@/types/portfolio";

interface PortfolioTableProps {
  stocks: CalculatedStock[];
}

export default function PortfolioTable({ stocks }: PortfolioTableProps) {
  // Extract unique sectors
  const sectors = Array.from(new Set(stocks.map((s) => s.sector)));

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">Stock / Particulars</th>
            <th className="px-4 py-3 whitespace-nowrap">NSE / BSE</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">Purchase Price</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">Qty</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">Investment</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">Portfolio %</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">CMP</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">Present Value</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">Gain / Loss</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">P/E Ratio</th>
            <th className="px-4 py-3 text-right whitespace-nowrap">Latest Earnings</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sectors.map((sectorName) => {
            const sectorStocks = stocks.filter((s) => s.sector === sectorName);
            const sectorInvestment = sectorStocks.reduce(
              (sum, s) => sum + s.investment,
              0
            );
            const sectorPresentValue = sectorStocks.reduce(
              (sum, s) => sum + s.presentValue,
              0
            );
            const sectorGainLoss = sectorPresentValue - sectorInvestment;
            const sectorGainLossPercent =
              sectorInvestment > 0
                ? (sectorGainLoss / sectorInvestment) * 100
                : 0;
            const isSectorProfit = sectorGainLoss >= 0;

            return (
              <React.Fragment key={sectorName}>
                {/* Sector Header Banner */}
                <tr className="bg-slate-100/90 font-semibold text-slate-800">
                  <td
                    colSpan={11}
                    className="px-4 py-2.5 text-xs tracking-wider uppercase whitespace-nowrap"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        📁 {sectorName} ({sectorStocks.length} stocks)
                      </span>
                      <span className="font-normal text-slate-600 lowercase tracking-normal">
                        Subtotal: ₹{sectorInvestment.toLocaleString("en-IN")} invested
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Stock Rows */}
                {sectorStocks.map((stock) => {
                  const isProfit = stock.gainLoss >= 0;

                  return (
                    <tr
                      key={stock.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {stock.name}
                      </td>

                      <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                        {stock.ticker}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-800 whitespace-nowrap">
                        ₹{stock.purchasePrice.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                        {stock.quantity}
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-800 whitespace-nowrap">
                        ₹{stock.investment.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                        {stock.portfolioPercentage.toFixed(2)}%
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                        ₹{stock.cmp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                        ₹{stock.presentValue.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-semibold ${
                              isProfit ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {isProfit ? "+" : ""}₹
                            {stock.gainLoss.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              isProfit ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {isProfit ? "+" : ""}
                            {stock.gainLossPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                        {stock.peRatio !== null ? stock.peRatio.toFixed(2) : "-"}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                        {stock.latestEarnings !== null
                          ? `₹${stock.latestEarnings.toFixed(2)}`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}

                {/* Sector Subtotal Footer Row */}
                <tr className="bg-slate-50 border-b-2 border-slate-200 text-xs font-semibold text-slate-700">
                  <td colSpan={4} className="px-4 py-2.5 text-right uppercase whitespace-nowrap">
                    {sectorName} Totals:
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-900 whitespace-nowrap">
                    ₹{sectorInvestment.toLocaleString("en-IN")}
                  </td>
                  <td colSpan={2}></td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-900 whitespace-nowrap">
                    ₹{sectorPresentValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold whitespace-nowrap">
                    <span
                      className={
                        isSectorProfit ? "text-emerald-600" : "text-rose-600"
                      }
                    >
                      {isSectorProfit ? "+" : ""}₹
                      {sectorGainLoss.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span>
                        ({isSectorProfit ? "+" : ""}
                        {sectorGainLossPercent.toFixed(2)}%)
                      </span>
                    </span>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
