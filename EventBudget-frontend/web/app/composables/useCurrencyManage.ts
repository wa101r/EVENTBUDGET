// web/app/composables/useCurrencyManage.ts
import { ref, computed, watch, onMounted } from "vue"
import { currencyMeta, getCurrencyLabel } from "~/shared/currencyMeta"

export const useCurrencyManage = () => {
  // ============ CONFIG (.env) ============
  const config = useRuntimeConfig()
  const BACKEND_API = `${config.public.apiBase}/currencies`
  const EXCHANGE_API_KEY = config.public.exchangeApiKey as string
  const EXCHANGE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`

  // ============ STATE ============
  const currenciesRaw = ref<any[]>([])
  const isLoading = ref(true)
  const isError = ref(false)

  const thbRates = ref<Record<string, number>>({})
  const isLiveLoading = ref(false)
  const liveError = ref<string | null>(null)

  // FX Converter
  const fxAmount = ref(1000)
  const fxFrom = ref("THB")
  const fxTo = ref("USD")

  // dropdown
  const fromSearch = ref("")
  const toSearch = ref("")
  const isFromOpen = ref(false)
  const isToOpen = ref(false)

  // เปิดอันนึง ปิดอีกอันเสมอ กันซ้อน
  watch(isFromOpen, (v) => { if (v) isToOpen.value = false })
  watch(isToOpen, (v) => { if (v) isFromOpen.value = false })

  // CRUD modal
  const isModalOpen = ref(false)
  const isEditing = ref(false)
  const editingId = ref<number | null>(null)
  const form = ref<{ code: string; name: string }>({ code: "", name: "" })

  // ============ DERIVED / HELPERS ============
  const currencies = computed(() =>
    currenciesRaw.value.map(c => ({ ...c, code: (c.code || "").toUpperCase() }))
  )

  // all codes for converter (THB + rates)
  const converterCodes = computed(() => {
    const set = new Set<string>(["THB", ...Object.keys(thbRates.value)])
    return Array.from(set).sort()
  })

  const popularPreset = ["JPY", "KRW", "CNY", "USD", "EUR", "THB"]
  const popularCodes = computed(() =>
    popularPreset.filter(c => converterCodes.value.includes(c))
  )

  // 1 THB = ? CODE
  const getRateTHBTo = (code: string) => {
    const c = code?.toUpperCase()
    if (!c) return null
    if (c === "THB") return 1
    return thbRates.value[c] ?? null
  }

  // UI live display: 1 CODE ≈ x THB
  const formatLiveRateCodeToTHB = (code: string) => {
    const r = getRateTHBTo(code)
    if (!r) return null
    return (1 / r).toFixed(4)
  }

  const getSystemRateToTHB = (code: string) => {
    const r = getRateTHBTo(code)
    return r ? 1 / r : null
  }

  const previewLiveRateForForm = computed(() =>
    form.value.code ? formatLiveRateCodeToTHB(form.value.code) : null
  )

  // FX rate from -> to (THB base)
  const calcRate = (from: string, to: string) => {
    const f = from.toUpperCase()
    const t = to.toUpperCase()
    if (f === t) return 1

    const map = thbRates.value
    const fromToThb = f === "THB" ? 1 : map[f] ? 1 / map[f] : null
    const thbToTo = t === "THB" ? 1 : map[t] || null
    if (!fromToThb || !thbToTo) return null

    return fromToThb * thbToTo
  }

  const fxRate = computed(() => calcRate(fxFrom.value, fxTo.value))
  const fxConverted = computed(() =>
    fxRate.value == null ? null : fxAmount.value * fxRate.value
  )
  const fxRateText = computed(() =>
    fxRate.value == null ? null : `1 ${fxFrom.value} ≈ ${fxRate.value.toFixed(4)} ${fxTo.value}`
  )

  const filteredFromCodes = computed(() => {
    const q = fromSearch.value.trim().toLowerCase()
    if (!q) return converterCodes.value
    return converterCodes.value.filter(code => {
      const lbl = (getCurrencyLabel(code) || "").toLowerCase()
      return code.toLowerCase().includes(q) || lbl.includes(q)
    })
  })

  const filteredToCodes = computed(() => {
    const q = toSearch.value.trim().toLowerCase()
    if (!q) return converterCodes.value
    return converterCodes.value.filter(code => {
      const lbl = (getCurrencyLabel(code) || "").toLowerCase()
      return code.toLowerCase().includes(q) || lbl.includes(q)
    })
  })

  // ============ LOADERS ============
  const loadCurrencies = async () => {
    try {
      isLoading.value = true
      isError.value = false
      const res: any = await $fetch(BACKEND_API)
      currenciesRaw.value = res?.data ?? res ?? []

      if (converterCodes.value.length && !converterCodes.value.includes(fxTo.value)) {
        fxTo.value = converterCodes.value[0]
      }
    } catch (e) {
      console.error("loadCurrencies error", e)
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const loadLiveRates = async () => {
    try {
      if (!EXCHANGE_API_KEY) {
        liveError.value = "ยังไม่ได้ตั้งค่า NUXT_PUBLIC_EXCHANGE_KEY"
        return
      }
      isLiveLoading.value = true
      liveError.value = null
      thbRates.value = {}

      const data: any = await $fetch(EXCHANGE_URL)
      if (data.result !== "success") throw new Error("API result not success")

      const conv = data.conversion_rates as Record<string, number>
      const usdToThb = conv["THB"]
      if (!usdToThb) throw new Error("THB not found")

      const result: Record<string, number> = {}
      for (const code of Object.keys(conv)) {
        result[code] = code === "THB" ? 1 : conv[code] / usdToThb
      }
      thbRates.value = result
    } catch (e) {
      console.error("loadLiveRates error", e)
      liveError.value = "ยังไม่สามารถดึง live rate ล่าสุดได้"
    } finally {
      isLiveLoading.value = false
    }
  }

  onMounted(async () => {
    await loadCurrencies()
    await loadLiveRates()
  })

  // auto-fill name from meta
  watch(() => form.value.code, (val) => {
    if (!val) return
    const code = val.toUpperCase()
    form.value.code = code
    if (!form.value.name.trim()) {
      const meta = currencyMeta[code]
      if (meta) {
        form.value.name = meta.country ? `${meta.name} (${meta.country})` : meta.name
      }
    }
  })

  // ============ CRUD ============
  const openAdd = () => {
    isEditing.value = false
    editingId.value = null
    form.value = { code: "", name: "" }
    isModalOpen.value = true
  }

  const openEdit = (cur: any) => {
    isEditing.value = true
    editingId.value = cur.id
    form.value = { code: cur.code ?? "", name: cur.name ?? "" }
    isModalOpen.value = true
  }

  const closeModal = () => { isModalOpen.value = false }

  const saveCurrency = async () => {
    if (!form.value.code.trim() || !form.value.name.trim()) return
    try {
      const code = form.value.code.toUpperCase()
      const payload = {
        code,
        name: form.value.name,
        rate_to_base: getSystemRateToTHB(code),
      }

      if (isEditing.value && editingId.value != null) {
        await $fetch(`${BACKEND_API}/${editingId.value}`, { method: "PUT", body: payload })
      } else {
        await $fetch(BACKEND_API, { method: "POST", body: payload })
      }

      await loadCurrencies()
      await loadLiveRates()
      closeModal()
    } catch (e) {
      console.error("saveCurrency error", e)
      alert("ไม่สามารถบันทึกสกุลเงินได้")
    }
  }

  const deleteCurrency = async (cur: any) => {
    if (!confirm(`ต้องการลบ "${cur.code} - ${cur.name}" จริงหรือไม่?`)) return
    try {
      await $fetch(`${BACKEND_API}/${cur.id}`, { method: "DELETE" })
      await loadCurrencies()
      await loadLiveRates()
    } catch (e) {
      console.error("deleteCurrency error", e)
      alert("ไม่สามารถลบสกุลเงินได้")
    }
  }

  const swapFx = () => {
    const tmp = fxFrom.value
    fxFrom.value = fxTo.value
    fxTo.value = tmp
  }

  return {
    currencies,
    isLoading,
    isError,

    thbRates,
    isLiveLoading,
    liveError,

    fxAmount,
    fxFrom,
    fxTo,
    fxConverted,
    fxRateText,
    popularCodes,

    fromSearch,
    toSearch,
    isFromOpen,
    isToOpen,
    filteredFromCodes,
    filteredToCodes,
    swapFx,

    isModalOpen,
    isEditing,
    form,
    previewLiveRateForForm,
    openAdd,
    openEdit,
    closeModal,
    saveCurrency,
    deleteCurrency,

    formatLiveRateCodeToTHB,
  }
}
