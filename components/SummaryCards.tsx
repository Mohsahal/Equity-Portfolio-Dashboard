import { PortfolioTotals } from "@/types/portfolio";

interface SummaryCardsProps {
  totals: PortfolioTotals;
  stockCount: number;
}

export default function SummaryCards({ totals, stockCount }: SummaryCardsProps) {
  const isProfit = totals.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Investment Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Total Investment
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          ₹{totals.totalInvestment.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-gray-500">Base capital allocated</p>
      </div>

      {/* Present Value Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Present Value
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          ₹{totals.totalPresentValue.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="mt-1 text-xs text-gray-500">Current market worth</p>
      </div>

      {/* Total Gain / Loss Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Total Gain / Loss
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold ${
              isProfit ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isProfit ? "+" : ""}₹
            {totals.totalGainLoss.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span
            className={`text-xs font-semibold ${
              isProfit ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            ({isProfit ? "+" : ""}
            {totals.totalGainLossPercentage.toFixed(2)}%)
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">Net portfolio return</p>
      </div>

      {/* Total Stocks Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Active Holdings
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{stockCount} Stocks</p>
        <p className="mt-1 text-xs text-gray-500">Across 6 diversified sectors</p>
      </div>
    </div>
  );
}
