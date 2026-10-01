const GOOGLE_SYMBOLS: Record<string, { symbol: string; exchange: string }> = {
  HDFCBANK: { symbol: "HDFCBANK", exchange: "NSE" },
  BAJFINANCE: { symbol: "BAJFINANCE", exchange: "NSE" },
  "532174": { symbol: "ICICIBANK", exchange: "NSE" },
  "544252": { symbol: "BAJAJHFL", exchange: "NSE" },
  "511577": { symbol: "511577", exchange: "BOM" },

  AFFLE: { symbol: "AFFLE", exchange: "NSE" },
  LTIM: { symbol: "LTIM", exchange: "NSE" },
  "542651": { symbol: "KPITTECH", exchange: "NSE" },
  "544028": { symbol: "TATATECH", exchange: "NSE" },
  "544107": { symbol: "BLSE", exchange: "NSE" },
  "532790": { symbol: "TANLA", exchange: "NSE" },

  DMART: { symbol: "DMART", exchange: "NSE" },
  "532540": { symbol: "TATACONSUM", exchange: "NSE" },
  "500331": { symbol: "PIDILITIND", exchange: "NSE" },

  "500400": { symbol: "TATAPOWER", exchange: "NSE" },
  "542323": { symbol: "KPIGREEN", exchange: "NSE" },
  "532667": { symbol: "SUZLON", exchange: "NSE" },
  "542851": { symbol: "GENSOL", exchange: "NSE" },

  "543517": { symbol: "HARIOMPIPE", exchange: "NSE" },
  ASTRAL: { symbol: "ASTRAL", exchange: "NSE" },
  "542652": { symbol: "POLYCAB", exchange: "NSE" },

  "543318": { symbol: "CLEAN", exchange: "NSE" },
  "506401": { symbol: "DEEPAKNTR", exchange: "NSE" },
  "541557": { symbol: "FINEORG", exchange: "NSE" },
  "533282": { symbol: "GRAVITA", exchange: "NSE" },
  "540719": { symbol: "SBILIFE", exchange: "NSE" },
};

export interface GoogleMetrics {
  peRatio: number | null;
  latestEarnings: number | null;
}

export async function fetchGoogleFinanceMetrics(
  ticker: string
): Promise<GoogleMetrics> {
  const target = GOOGLE_SYMBOLS[ticker] || {
    symbol: ticker,
    exchange: "NSE",
  };

  try {
    const url = `https://www.google.com/finance/quote/${encodeURIComponent(
      target.symbol
    )}:${encodeURIComponent(target.exchange)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return { peRatio: null, latestEarnings: null };
    }

    const html = await res.text();

    let peRatio: number | null = null;
    const peMatch = html.match(
      /P\/E ratio[^<]*<\/div>[\s\S]*?<div[^>]*>([0-9\.]+)/
    );
    if (peMatch?.[1]) {
      const parsed = parseFloat(peMatch[1]);
      if (!isNaN(parsed)) peRatio = parsed;
    }

    let latestEarnings: number | null = null;
    const epsMatch = html.match(
      /EPS[^<]*<\/div>[\s\S]*?<div[^>]*>[^0-9\-]*([0-9\.\-]+)/
    );
    if (epsMatch?.[1]) {
      const parsed = parseFloat(epsMatch[1]);
      if (!isNaN(parsed)) latestEarnings = parsed;
    }

    return { peRatio, latestEarnings };
  } catch {
    return { peRatio: null, latestEarnings: null };
  }
}
