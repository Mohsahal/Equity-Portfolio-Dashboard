import { SectorSummary as SectorSummaryType } from "@/types/portfolio";

interface SectorSummaryProps {
  sectors: SectorSummaryType[];
}

export default function SectorSummary({ sectors }: SectorSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Sector Allocation & Performance
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Aggregated capital and return distribution across sectors
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3 text-center">Holdings</th>
              <th className="px-4 py-3 text-right">Total Investment</th>
              <th className="px-4 py-3 text-right">Present Value</th>
              <th className="px-4 py-3 text-right">Gain / Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sectors.map((sec) => {
              const isProfit = sec.totalGainLoss >= 0;
              return (
                <tr key={sec.sector} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                      {sec.sector}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 font-medium">
                    {sec.stockCount}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    ₹{sec.totalInvestment.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ₹{sec.totalPresentValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    <span className={isProfit ? "text-emerald-600" : "text-rose-600"}>
                      {isProfit ? "+" : ""}₹
                      {sec.totalGainLoss.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-xs font-medium">
                        ({isProfit ? "+" : ""}
                        {sec.gainLossPercentage.toFixed(2)}%)
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
