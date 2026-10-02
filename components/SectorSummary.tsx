import React from "react";
import { SectorSummary as SectorSummaryType } from "@/types/portfolio";

interface Props {
  sectors: SectorSummaryType[];
}

export default function SectorSummary({ sectors }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Sector Allocation & Performance
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="p-3">Sector</th>
              <th className="p-3 text-center">Stocks</th>
              <th className="p-3 text-right">Total Investment</th>
              <th className="p-3 text-right">Present Value</th>
              <th className="p-3 text-right">Gain / Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sectors.map((sec) => {
              const isProfit = sec.totalGainLoss >= 0;

              return (
                <tr key={sec.sector} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{sec.sector}</td>
                  <td className="p-3 text-center text-gray-600">{sec.stockCount}</td>
                  <td className="p-3 text-right">
                    ₹{sec.totalInvestment.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-right">
                    ₹{sec.totalPresentValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className={`p-3 text-right font-semibold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                    {isProfit ? "+" : ""}₹{sec.totalGainLoss.toLocaleString("en-IN", { minimumFractionDigits: 2 })}{" "}
                    <span className="text-xs">
                      ({isProfit ? "+" : ""}{sec.gainLossPercentage.toFixed(2)}%)
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
