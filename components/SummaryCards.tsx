import React from "react";
import { PortfolioTotals } from "@/types/portfolio";

interface Props {
  totals: PortfolioTotals;
  stockCount: number;
}

export default function SummaryCards({ totals, stockCount }: Props) {
  const isProfit = totals.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs uppercase font-medium text-gray-500">Total Investment</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          ₹{totals.totalInvestment.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-gray-500">Total base capital</p>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs uppercase font-medium text-gray-500">Present Value</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          ₹{totals.totalPresentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
        <p className="mt-1 text-xs text-gray-500">Current market value</p>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs uppercase font-medium text-gray-500">Total Gain / Loss</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
            {isProfit ? "+" : ""}₹{totals.totalGainLoss.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span className={`text-xs font-semibold ${isProfit ? "text-green-700" : "text-red-700"}`}>
            ({isProfit ? "+" : ""}{totals.totalGainLossPercentage.toFixed(2)}%)
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">Total portfolio return</p>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs uppercase font-medium text-gray-500">Active Holdings</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{stockCount} Stocks</p>
        <p className="mt-1 text-xs text-gray-500">Across 6 sectors</p>
      </div>
    </div>
  );
}
