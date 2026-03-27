export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20AC", name: "Euro" },
  { code: "GBP", symbol: "\u00A3", name: "British Pound" },
  { code: "INR", symbol: "\u20B9", name: "Indian Rupee" },
  { code: "JPY", symbol: "\u00A5", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "\u00A5", name: "Chinese Yuan" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "KRW", symbol: "\u20A9", name: "South Korean Won" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
  { code: "NGN", symbol: "\u20A6", name: "Nigerian Naira" },
];

const CURRENCY_KEY = "invoicer_currency";

export function getSavedCurrency(): Currency {
  if (typeof window === "undefined") return currencies[0];
  const code = localStorage.getItem(CURRENCY_KEY);
  return currencies.find((c) => c.code === code) ?? currencies[0];
}

export function saveCurrency(code: string): void {
  localStorage.setItem(CURRENCY_KEY, code);
}

export function formatAmount(amount: number, currency: Currency): string {
  return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
