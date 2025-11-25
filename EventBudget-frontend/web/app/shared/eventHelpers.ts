import { getCurrencyLabel } from "~/shared/currencyMeta";

// ============ FORMAT HELPERS ============
export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// generic money formatter (รองรับทุกสกุล)
export const formatMoney = (amount: any, code = "THB") => {
  if (amount == null || amount === "") return "0";
  const c = code.toUpperCase();
  try {
    return new Intl.NumberFormat(c === "THB" ? "th-TH" : "en-US", {
      style: "currency",
      currency: c,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${Number(amount).toFixed(2)} ${c}`;
  }
};

// ----- HELPER map field จาก API -----
export const getEventName = (e: any) =>
  e.name || e.event_name || e.title || "Untitled Event";

export const getClientName = (e: any) =>
  e.client_name || e.client || e.customer_name || "-";

export const getStartDate = (e: any) =>
  e.start_date || e.start || e.startDate || "";

export const getEndDate = (e: any) =>
  e.end_date || e.end || e.endDate || "";

// helper: per-event base currency & amount
export const getEventCurrency = (e: any) =>
  (e.currency_code || e.currency || "THB").toUpperCase();

export const getEventBaseAmount = (e: any) =>
  e.base_total ?? e.total ?? e.total_budget ?? e.budget_amount ?? 0;

// สถานะอีเวนต์ จากวันที่วันนี้เทียบกับ start/end
export const getStatusInfo = (e: any) => {
  const startRaw = getStartDate(e);
  const endRaw = getEndDate(e);

  if (!startRaw && !endRaw) {
    return { label: "No date", bg: "bg-slate-100", text: "text-slate-500" };
  }

  const now = new Date();
  const start = startRaw ? new Date(startRaw) : null;
  const end = endRaw ? new Date(endRaw) : null;

  if (start && end && now >= start && now <= end) {
    return { label: "Ongoing", bg: "bg-blue-50", text: "text-blue-600" };
  }
  if (end && now > end) {
    return { label: "Done", bg: "bg-slate-100", text: "text-slate-600" };
  }
  return { label: "Upcoming", bg: "bg-emerald-50", text: "text-emerald-600" };
};

// convert amount จาก from -> to ด้วย thbRates ที่ parent โหลดมา
export const convertAmount = (
  amount: number,
  fromCode: string,
  toCode: string,
  thbRates: Record<string, number>
) => {
  if (!amount || !fromCode || !toCode) return null;

  const from = fromCode.toUpperCase();
  const to = toCode.toUpperCase();
  if (from === to) return Number(amount);

  const fromRate = from === "THB" ? 1 : thbRates[from];
  const toRate = to === "THB" ? 1 : thbRates[to];
  if (fromRate == null || toRate == null) return null;

  // from -> THB
  let amountThb: number;
  if (from === "THB") amountThb = Number(amount);
  else amountThb = Number(amount) / fromRate;

  // THB -> to
  if (to === "THB") return amountThb;
  return amountThb * toRate;
};

export const getCurrencyText = (code: string) =>
  `${code} - ${getCurrencyLabel(code) || "Unknown currency"}`;
