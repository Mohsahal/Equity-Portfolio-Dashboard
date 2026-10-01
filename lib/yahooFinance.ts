const YAHOO_SYMBOLS: Record<string, string> = {
  HDFCBANK: "HDFCBANK.NS",
  BAJFINANCE: "BAJFINANCE.NS",
  "532174": "ICICIBANK.NS",
  "544252": "BAJAJHFL.NS",
  "511577": "511577.BO",

  AFFLE: "AFFLE.NS",
  LTIM: "LTIM.NS",
  "542651": "KPITTECH.NS",
  "544028": "TATATECH.NS",
  "544107": "BLSE.NS",
  "532790": "TANLA.NS",

  DMART: "DMART.NS",
  "532540": "TATACONSUM.NS",
  "500331": "PIDILITIND.NS",

  "500400": "TATAPOWER.NS",
  "542323": "KPIGREEN.NS",
  "532667": "SUZLON.NS",
  "542851": "GENSOL.NS",

  "543517": "HARIOMPIPE.NS",
  ASTRAL: "ASTRAL.NS",
  "542652": "POLYCAB.NS",

  "543318": "CLEAN.NS",
  "506401": "DEEPAKNTR.NS",
  "541557": "FINEORG.NS",
  "533282": "GRAVITA.NS",
  "540719": "SBILIFE.NS",
};

export async function fetchYahooCMP(ticker: string): Promise<number | null> {
  const symbol = YAHOO_SYMBOLS[ticker] || (ticker.includes(".") ? ticker : `${ticker}.NS`);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    return typeof price === "number" && !isNaN(price) ? price : null;
  } catch {
    return null;
  }
}
