// web/app/shared/currencyMeta.ts

export interface CurrencyInfo {
  /** ชื่อเต็มของสกุลเงิน */
  name: string
  /** ประเทศหลักที่ใช้ (ถ้ามี) */
  country?: string
  /** ไอคอน / ธง ของสกุลเงิน (optional) */
  emoji?: string
  /** ใช้สร้างธงอัตโนมัติ (ISO country code) */
  countryCode?: string
}

/**
 * helper: ทำ countryCode -> emoji ธง (เช่น 'US' -> 🇺🇸)
 * ถ้าใส่ countryCode มาแต่ไม่ใส่ emoji จะสร้างให้อัตโนมัติ
 */
export const countryCodeToFlag = (cc?: string): string | undefined => {
  if (!cc || cc.length !== 2) return undefined
  const code = cc.toUpperCase()
  // Regional Indicator Symbols
  const A = 0x1f1e6
  const chars = [...code].map(ch => String.fromCodePoint(A + ch.charCodeAt(0) - 65))
  return chars.join('')
}

/**
 * Currency metadata — ใส่ธง “ตัวจริง” ให้สกุลหลัก ๆ + countryCode สำหรับ auto-flag
 * สกุลที่ใช้หลายประเทศ/ไม่มีธงชัดเจน จะใช้ emoji เฉพาะของสกุล (เช่น 💶) หรือ 🌐
 */
export const currencyMeta: Record<string, CurrencyInfo> = {
  // ===== Popular / Main =====
  USD: { name: "US Dollar", country: "United States", countryCode: "US", emoji: "🇺🇸" },
  THB: { name: "Thai Baht", country: "Thailand", countryCode: "TH", emoji: "🇹🇭" },
  EUR: { name: "Euro", country: "Eurozone", emoji: "🇪🇺" },
  GBP: { name: "British Pound Sterling", country: "United Kingdom", countryCode: "GB", emoji: "🇬🇧" },
  JPY: { name: "Japanese Yen", country: "Japan", countryCode: "JP", emoji: "🇯🇵" },
  KRW: { name: "South Korean Won", country: "South Korea", countryCode: "KR", emoji: "🇰🇷" },
  CNY: { name: "Chinese Yuan", country: "China", countryCode: "CN", emoji: "🇨🇳" },
  HKD: { name: "Hong Kong Dollar", country: "Hong Kong", countryCode: "HK", emoji: "🇭🇰" },
  SGD: { name: "Singapore Dollar", country: "Singapore", countryCode: "SG", emoji: "🇸🇬" },
  AUD: { name: "Australian Dollar", country: "Australia", countryCode: "AU", emoji: "🇦🇺" },
  CAD: { name: "Canadian Dollar", country: "Canada", countryCode: "CA", emoji: "🇨🇦" },
  CHF: { name: "Swiss Franc", country: "Switzerland", countryCode: "CH", emoji: "🇨🇭" },
  NZD: { name: "New Zealand Dollar", country: "New Zealand", countryCode: "NZ", emoji: "🇳🇿" },

  // ===== Middle East & Central Asia =====
  AED: { name: "UAE Dirham", country: "United Arab Emirates", countryCode: "AE", emoji: "🇦🇪" },
  AFN: { name: "Afghan Afghani", country: "Afghanistan", countryCode: "AF", emoji: "🇦🇫" }, // เพิ่ม
  AMD: { name: "Armenian Dram", country: "Armenia", countryCode: "AM", emoji: "🇦🇲" }, // เพิ่ม
  AZN: { name: "Azerbaijani Manat", country: "Azerbaijan", countryCode: "AZ", emoji: "🇦🇿" }, // เพิ่ม
  SAR: { name: "Saudi Riyal", country: "Saudi Arabia", countryCode: "SA", emoji: "🇸🇦" },
  QAR: { name: "Qatari Riyal", country: "Qatar", countryCode: "QA", emoji: "🇶🇦" },
  KWD: { name: "Kuwaiti Dinar", country: "Kuwait", countryCode: "KW", emoji: "🇰🇼" },
  BHD: { name: "Bahraini Dinar", country: "Bahrain", countryCode: "BH", emoji: "🇧🇭" },
  OMR: { name: "Omani Rial", country: "Oman", countryCode: "OM", emoji: "🇴🇲" },
  ILS: { name: "Israeli New Shekel", country: "Israel", countryCode: "IL", emoji: "🇮🇱" },
  IRR: { name: "Iranian Rial", country: "Iran", countryCode: "IR", emoji: "🇮🇷" },
  IQD: { name: "Iraqi Dinar", country: "Iraq", countryCode: "IQ", emoji: "🇮🇶" },
  JOD: { name: "Jordanian Dinar", country: "Jordan", countryCode: "JO", emoji: "🇯🇴" },
  TRY: { name: "Turkish Lira", country: "Turkey", countryCode: "TR", emoji: "🇹🇷" },
  YER: { name: "Yemeni Rial", country: "Yemen", countryCode: "YE", emoji: "🇾🇪" },

  // ===== Asia & Pacific =====
  INR: { name: "Indian Rupee", country: "India", countryCode: "IN", emoji: "🇮🇳" },
  IDR: { name: "Indonesian Rupiah", country: "Indonesia", countryCode: "ID", emoji: "🇮🇩" },
  MYR: { name: "Malaysian Ringgit", country: "Malaysia", countryCode: "MY", emoji: "🇲🇾" },
  PHP: { name: "Philippine Peso", country: "Philippines", countryCode: "PH", emoji: "🇵🇭" },
  VND: { name: "Vietnamese Đồng", country: "Vietnam", countryCode: "VN", emoji: "🇻🇳" },
  TWD: { name: "New Taiwan Dollar", country: "Taiwan", countryCode: "TW", emoji: "🇹🇼" },
  LAK: { name: "Lao Kip", country: "Laos", countryCode: "LA", emoji: "🇱🇦" },
  KHR: { name: "Cambodian Riel", country: "Cambodia", countryCode: "KH", emoji: "🇰🇭" },
  MMK: { name: "Myanmar Kyat", country: "Myanmar", countryCode: "MM", emoji: "🇲🇲" },
  LKR: { name: "Sri Lankan Rupee", country: "Sri Lanka", countryCode: "LK", emoji: "🇱🇰" },
  NPR: { name: "Nepalese Rupee", country: "Nepal", countryCode: "NP", emoji: "🇳🇵" },
  BDT: { name: "Bangladeshi Taka", country: "Bangladesh", countryCode: "BD", emoji: "🇧🇩" },
  PKR: { name: "Pakistani Rupee", country: "Pakistan", countryCode: "PK", emoji: "🇵🇰" },
  BTN: { name: "Bhutanese Ngultrum", country: "Bhutan", countryCode: "BT", emoji: "🇧🇹" },
  MVR: { name: "Maldivian Rufiyaa", country: "Maldives", countryCode: "MV", emoji: "🇲🇻" },

  // ===== Europe =====
  ALL: { name: "Albanian Lek", country: "Albania", countryCode: "AL", emoji: "🇦🇱" }, // เพิ่ม
  SEK: { name: "Swedish Krona", country: "Sweden", countryCode: "SE", emoji: "🇸🇪" },
  NOK: { name: "Norwegian Krone", country: "Norway", countryCode: "NO", emoji: "🇳🇴" },
  DKK: { name: "Danish Krone", country: "Denmark", countryCode: "DK", emoji: "🇩🇰" },
  PLN: { name: "Polish Złoty", country: "Poland", countryCode: "PL", emoji: "🇵🇱" },
  CZK: { name: "Czech Koruna", country: "Czech Republic", countryCode: "CZ", emoji: "🇨🇿" },
  HUF: { name: "Hungarian Forint", country: "Hungary", countryCode: "HU", emoji: "🇭🇺" },
  RON: { name: "Romanian Leu", country: "Romania", countryCode: "RO", emoji: "🇷🇴" },
  BGN: { name: "Bulgarian Lev", country: "Bulgaria", countryCode: "BG", emoji: "🇧🇬" },
  HRK: { name: "Croatian Kuna", country: "Croatia", countryCode: "HR", emoji: "🇭🇷" },
  RSD: { name: "Serbian Dinar", country: "Serbia", countryCode: "RS", emoji: "🇷🇸" },
  RUB: { name: "Russian Ruble", country: "Russia", countryCode: "RU", emoji: "🇷🇺" },
  UAH: { name: "Ukrainian Hryvnia", country: "Ukraine", countryCode: "UA", emoji: "🇺🇦" },
  ISK: { name: "Icelandic Króna", country: "Iceland", countryCode: "IS", emoji: "🇮🇸" },
  GEL: { name: "Georgian Lari", country: "Georgia", countryCode: "GE", emoji: "🇬🇪" },
  BAM: { name: "Bosnia-Herzegovina Mark", country: "Bosnia", countryCode: "BA", emoji: "🇧🇦" },
  BYN: { name: "Belarusian Ruble", country: "Belarus", countryCode: "BY", emoji: "🇧🇾" },
  MDL: { name: "Moldovan Leu", country: "Moldova", countryCode: "MD", emoji: "🇲🇩" },
  MKD: { name: "Macedonian Denar", country: "North Macedonia", countryCode: "MK", emoji: "🇲🇰" },

  // ===== Americas & Caribbean =====
  ANG: { name: "Neth. Antillean Guilder", country: "Curaçao", countryCode: "CW", emoji: "🇨🇼" }, // เพิ่ม
  AWG: { name: "Aruban Florin", country: "Aruba", countryCode: "AW", emoji: "🇦🇼" }, // เพิ่ม
  MXN: { name: "Mexican Peso", country: "Mexico", countryCode: "MX", emoji: "🇲🇽" },
  BRL: { name: "Brazilian Real", country: "Brazil", countryCode: "BR", emoji: "🇧🇷" },
  ARS: { name: "Argentine Peso", country: "Argentina", countryCode: "AR", emoji: "🇦🇷" },
  CLP: { name: "Chilean Peso", country: "Chile", countryCode: "CL", emoji: "🇨🇱" },
  COP: { name: "Colombian Peso", country: "Colombia", countryCode: "CO", emoji: "🇨🇴" },
  PEN: { name: "Peruvian Sol", country: "Peru", countryCode: "PE", emoji: "🇵🇪" },
  UYU: { name: "Uruguayan Peso", country: "Uruguay", countryCode: "UY", emoji: "🇺🇾" },
  PYG: { name: "Paraguayan Guaraní", country: "Paraguay", countryCode: "PY", emoji: "🇵🇾" },
  BOB: { name: "Bolivian Boliviano", country: "Bolivia", countryCode: "BO", emoji: "🇧🇴" },
  VES: { name: "Venezuelan Bolívar", country: "Venezuela", countryCode: "VE", emoji: "🇻🇪" },
  GTQ: { name: "Guatemalan Quetzal", country: "Guatemala", countryCode: "GT", emoji: "🇬🇹" },
  CRC: { name: "Costa Rican Colón", country: "Costa Rica", countryCode: "CR", emoji: "🇨🇷" },
  DOP: { name: "Dominican Peso", country: "Dominican Republic", countryCode: "DO", emoji: "🇩🇴" },

  // ===== Africa =====
  ZAR: { name: "South African Rand", country: "South Africa", countryCode: "ZA", emoji: "🇿🇦" },
  EGP: { name: "Egyptian Pound", country: "Egypt", countryCode: "EG", emoji: "🇪🇬" },
  NGN: { name: "Nigerian Naira", country: "Nigeria", countryCode: "NG", emoji: "🇳🇬" },
  KES: { name: "Kenyan Shilling", country: "Kenya", countryCode: "KE", emoji: "🇰🇪" },
  GHS: { name: "Ghanaian Cedi", country: "Ghana", countryCode: "GH", emoji: "🇬🇭" },
  MAD: { name: "Moroccan Dirham", country: "Morocco", countryCode: "MA", emoji: "🇲🇦" },
  DZD: { name: "Algerian Dinar", country: "Algeria", countryCode: "DZ", emoji: "🇩🇿" },
  TND: { name: "Tunisian Dinar", country: "Tunisia", countryCode: "TN", emoji: "🇹🇳" },
  ETB: { name: "Ethiopian Birr", country: "Ethiopia", countryCode: "ET", emoji: "🇪🇹" },
  AOA: { name: "Angolan Kwanza", country: "Angola", countryCode: "AO", emoji: "🇦🇴" }, // เพิ่ม
  TZS: { name: "Tanzanian Shilling", country: "Tanzania", countryCode: "TZ", emoji: "🇹🇿" },
  UGX: { name: "Ugandan Shilling", country: "Uganda", countryCode: "UG", emoji: "🇺🇬" },

  // ===== Multi-country / Special =====
  XAF: { name: "Central African CFA Franc", country: "CEMAC", emoji: "🌍" },
  XOF: { name: "West African CFA Franc", country: "UEMOA", emoji: "🌍" },
  XCD: { name: "East Caribbean Dollar", country: "OECS", emoji: "🏝️" },
  XPF: { name: "CFP Franc", country: "Pacific Territories", emoji: "🏝️" },
  XDR: { name: "Special Drawing Rights", country: "IMF", emoji: "🏦" },
}

/**
 * fallback label
 */
export const getCurrencyLabel = (code: string): string => {
  const c = code?.toUpperCase?.() || code
  const meta = currencyMeta[c]
  if (!meta) return c
  return meta.country ? `${meta.name} (${meta.country})` : meta.name
}

/**
 * ใช้ดึง emoji ธงแบบปลอดภัย
 */
export const getCurrencyEmoji = (code: string): string => {
  const c = code?.toUpperCase?.() || code
  const meta = currencyMeta[c]
  if (!meta) return "🌐"
  if (meta.emoji) return meta.emoji
  const auto = countryCodeToFlag(meta.countryCode)
  return auto || "🌐"
}