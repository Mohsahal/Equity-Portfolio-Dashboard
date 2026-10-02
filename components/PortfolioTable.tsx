import React from "react";
import { CalculatedStock } from "@/types/portfolio";

interface Props {
  stocks: CalculatedStock[];
}

export default function PortfolioTable({ stocks }: Props) {
  const sectors: string[] = [];
  for (const stock of stocks) {
    if (!sectors.includes(stock.sector)) {
      sectors.push(stock.sector);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="p-3 whitespace-nowrap">Stock / Particulars</th>
              <th className="p-3 whitespace-nowrap">Code</th>
              <th className="p-3 text-right whitespace-nowrap">Purchase Price</th>
              <th className="p-3 text-right whitespace-nowrap">Qty</th>
              <th className="p-3 text-right whitespace-nowrap">Investment</th>
              <th className="p-3 text-right whitespace-nowrap">Portfolio %</th>
              <th className="p-3 text-right whitespace-nowrap">CMP</th>
              <th className="p-3 text-right whitespace-nowrap">Present Value</th>
              <th className="p-3 text-right whitespace-nowrap">Gain / Loss</th>
              <th className="p-3 text-right whitespace-nowrap">P/E</th>
              <th className="p-3 text-right whitespace-nowrap">Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sectors.map((sector) => {
              const sectorStocks = stocks.filter((s) => s.sector === sector);

              let sectorInvestment = 0;
              let sectorPresentValue = 0;
              for (const s of sectorStocks) {
                sectorInvestment += s.investment;
                sectorPresentValue += s.presentValue;
              }

              const sectorGainLoss = sectorPresentValue - sectorInvestment;
              const sectorGainLossPercent =
                sectorInvestment > 0
                  ? (sectorGainLoss / sectorInvestment) * 100
                  : 0;

              return (
                <React.Fragment key={sector}>
                  <tr className="bg-gray-100 font-semibold text-gray-800">
                    <td colSpan={11} className="px-3 py-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span>{sector} ({sectorStocks.length} stocks)</span>
                        <span>Invested: ₹{sectorInvestment.toLocaleString("en-IN")}</span>
                      </div>
                    </td>
                  </tr>

                  {sectorStocks.map((stock) => {
                    const isProfit = stock.gainLoss >= 0;

                    return (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 whitespace-nowrap">
                          {stock.name}
                        </td>
                        <td className="p-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                          {stock.ticker}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          ₹{stock.purchasePrice.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {stock.quantity}
                        </td>
                        <td className="p-3 text-right font-medium whitespace-nowrap">
                          ₹{stock.investment.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-right text-gray-500 whitespace-nowrap">
                          {stock.portfolioPercentage.toFixed(2)}%
                        </td>
                        <td className="p-3 text-right font-semibold whitespace-nowrap">
                          ₹{stock.cmp.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-medium whitespace-nowrap">
                          ₹{stock.presentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className={`font-semibold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                            {isProfit ? "+" : ""}₹{stock.gainLoss.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </div>
                          <div className={`text-xs ${isProfit ? "text-green-700" : "text-red-700"}`}>
                            {isProfit ? "+" : ""}{stock.gainLossPercentage.toFixed(2)}%
                          </div>
                        </td>
                        <td className="p-3 text-right text-gray-600 whitespace-nowrap">
                          {stock.peRatio !== null ? stock.peRatio.toFixed(2) : "-"}
                        </td>
                        <td className="p-3 text-right text-gray-600 whitespace-nowrap">
                          {stock.latestEarnings !== null ? `₹${stock.latestEarnings.toFixed(2)}` : "-"}
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="bg-gray-50 font-semibold text-xs border-b border-gray-200">
                    <td colSpan={4} className="p-2 text-right uppercase text-gray-500">
                      {sector} Total:
                    </td>
                    <td className="p-2 text-right">
                      ₹{sectorInvestment.toLocaleString("en-IN")}
                    </td>
                    <td colSpan={2}></td>
                    <td className="p-2 text-right">
                      ₹{sectorPresentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`p-2 text-right ${sectorGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {sectorGainLoss >= 0 ? "+" : ""}₹{sectorGainLoss.toLocaleString("en-IN", { minimumFractionDigits: 2 })}{" "}
                      ({sectorGainLoss >= 0 ? "+" : ""}{sectorGainLossPercent.toFixed(2)}%)
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
