<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { currencyMeta, getCurrencyLabel } from '~/shared/currencyMeta'

// ================== ICON HELPERS ==================
const symbolMap: Record<string, string> = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  THB: '฿',
  CNY: '¥'
}

// ใช้ใน dropdown + list
const getCurrencyIcon = (code: string): string => {
  const c = code?.toUpperCase() || ''
  if (!c) return '🌐'

  const meta = currencyMeta[c]
  if (meta?.emoji) return meta.emoji

  if (symbolMap[c]) return symbolMap[c]

  return '🌐'
}

// ================== PAGE META ==================
definePageMeta({
  layout: 'header',
  title: 'Currency Management'
})

// ================== CONFIG จาก .env ==================
const config = useRuntimeConfig()
// NUXT_PUBLIC_API_BASE  เช่น http://127.0.0.1:8000/api
// NUXT_PUBLIC_EXCHANGE_KEY เช่น 0287...
const BACKEND_API = `${config.public.apiBase}/currencies`
const EXCHANGE_API_KEY = config.public.exchangeApiKey as string
const EXCHANGE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`

// ================== STATE หลัก ==================
const currenciesRaw = ref<any[]>([])
const isLoading = ref(true)
const isError = ref(false)

// live rate: 1 THB = x CODE (เช่น { USD: 0.03, JPY: 4.8, ... })
const thbRates = ref<Record<string, number>>({})
const isLiveLoading = ref(false)
const liveError = ref<string | null>(null)

// ------- QUICK FX CONVERTER (ไป–กลับ) -------
const fxAmount = ref(1000)
const fxFrom = ref('THB')
const fxTo = ref('USD')

// searchable dropdown state
const fromSearch = ref('')
const toSearch = ref('')
const isFromOpen = ref(false)
const isToOpen = ref(false)

// ------- MODAL CRUD -------
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  code: '',
  name: ''
})

// ================== HELPERS: สกุลเงินในระบบ ==================
const currencies = computed(() =>
  currenciesRaw.value.map((c) => ({
    ...c,
    code: (c.code || '').toUpperCase()
  }))
)

// ใช้กับ converter: THB + ทุกสกุลที่มี live rate
const converterCodes = computed(() => {
  const set = new Set<string>(['THB', ...Object.keys(thbRates.value)])
  return Array.from(set).sort()
})

// ปุ่มลัดประเทศยอดนิยม
const popularPreset = ['JPY', 'KRW', 'CNY', 'USD', 'EUR', 'THB']
const popularCodes = computed(() =>
  popularPreset.filter((c) => converterCodes.value.includes(c))
)

// ================== RATE HELPERS ==================
// 1 THB = ? CODE
const getRateTHBTo = (code: string): number | null => {
  const c = code?.toUpperCase()
  if (!c) return null
  if (c === 'THB') return 1
  const r = thbRates.value[c]
  return r ?? null
}

// ใช้เก็บลง DB: 1 CODE = ? THB (จาก live rate)
const getSystemRateToTHB = (code: string): number | null => {
  const r = getRateTHBTo(code)
  if (!r) return null
  return 1 / r // r = 1 THB = r CODE → 1 CODE = 1/r THB
}

// ใช้แสดงใน UI: 1 CODE ≈ x THB
const formatLiveRateCodeToTHB = (code: string): string | null => {
  const r = getRateTHBTo(code)
  if (!r) return null
  const codeToThb = 1 / r
  return codeToThb.toFixed(4)
}

// preview live rate ใน modal
const previewLiveRateForForm = computed(() => {
  if (!form.value.code) return null
  return formatLiveRateCodeToTHB(form.value.code.toUpperCase())
})

// ================== FX CALC ==================
const calcRate = (from: string, to: string): number | null => {
  if (!from || !to) return null
  from = from.toUpperCase()
  to = to.toUpperCase()
  if (from === to) return 1

  const map = thbRates.value as Record<string, number>

  // map: 1 THB = map[CODE]
  const fromToThb = from === 'THB' ? 1 : (map[from] ? 1 / map[from] : null) // 1 from = ? THB
  const thbToTo = to === 'THB' ? 1 : map[to] || null                         // 1 THB = ? to

  if (!fromToThb || !thbToTo) return null
  return fromToThb * thbToTo // 1 from = THB * (THB -> to)
}

const fxRate = computed(() => calcRate(fxFrom.value, fxTo.value))

const fxConverted = computed(() => {
  const r = fxRate.value
  if (r == null) return null
  return fxAmount.value * r
})

const fxRateText = computed(() => {
  if (fxRate.value == null) return null
  return `1 ${fxFrom.value} ≈ ${fxRate.value.toFixed(4)} ${fxTo.value}`
})

// ================== SEARCHABLE DROPDOWN HELPERS ==================
const filteredFromCodes = computed(() => {
  const q = fromSearch.value.trim().toLowerCase()
  return converterCodes.value.filter((code) => {
    const label = (getCurrencyLabel(code) || '').toLowerCase()
    return !q || code.toLowerCase().includes(q) || label.includes(q)
  })
})

const filteredToCodes = computed(() => {
  const q = toSearch.value.trim().toLowerCase()
  return converterCodes.value.filter((code) => {
    const label = (getCurrencyLabel(code) || '').toLowerCase()
    return !q || code.toLowerCase().includes(q) || label.includes(q)
  })
})

const selectFromCode = (code: string) => {
  fxFrom.value = code
  isFromOpen.value = false
}

const selectToCode = (code: string) => {
  fxTo.value = code
  isToOpen.value = false
}

// ================== LOAD BACKEND ==================
const loadCurrencies = async () => {
  try {
    isLoading.value = true
    isError.value = false
    const res: any = await $fetch(BACKEND_API)
    currenciesRaw.value = res?.data ?? res ?? []

    if (converterCodes.value.length > 0 && !converterCodes.value.includes(fxTo.value)) {
      fxTo.value = converterCodes.value[0]
    }
  } catch (err) {
    console.error('Failed to load currencies', err)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

// ================== LOAD LIVE RATES (THB base) ==================
const loadLiveRates = async () => {
  try {
    isLiveLoading.value = true
    liveError.value = null
    thbRates.value = {}

    const data: any = await $fetch(EXCHANGE_URL)
    if (data.result !== 'success') {
      throw new Error('API result not success')
    }

    const conv = data.conversion_rates as Record<string, number>
    const usdToThb = conv['THB']
    if (!usdToThb) {
      throw new Error('THB not found in conversion_rates')
    }

    const result: Record<string, number> = {}

    // ให้ได้ 1 THB = ? CODE
    for (const code of Object.keys(conv)) {
      if (code === 'THB') {
        result['THB'] = 1
        continue
      }
      // 1 USD = conv[code] CODE
      // 1 USD = usdToThb THB
      // 1 THB = conv[code] / usdToThb CODE
      result[code] = conv[code] / usdToThb
    }

    thbRates.value = result
  } catch (err) {
    console.error('Failed to load live THB rates', err)
    liveError.value = 'ยังไม่สามารถดึงค่า live rate ล่าสุดจาก API ได้'
  } finally {
    isLiveLoading.value = false
  }
}

// โหลดตอนเข้าเพจ
onMounted(async () => {
  await loadCurrencies()
  await loadLiveRates()
})

// ================== AUTO-FILL NAME จาก CODE ==================
watch(
  () => form.value.code,
  (val) => {
    if (!val) return
    const code = val.toUpperCase()
    form.value.code = code

    if (!form.value.name.trim()) {
      const meta = currencyMeta[code]
      if (meta) {
        form.value.name = meta.country
          ? `${meta.name} (${meta.country})`
          : meta.name
      }
    }
  }
)

// ================== CRUD ==================
const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { code: '', name: '' }
  isModalOpen.value = true
}

const openEdit = (cur: any) => {
  isEditing.value = true
  editingId.value = cur.id
  form.value = {
    code: cur.code ?? '',
    name: cur.name ?? ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCurrency = async () => {
  if (!form.value.code.trim() || !form.value.name.trim()) return

  try {
    const code = form.value.code.toUpperCase()
    const systemRate = getSystemRateToTHB(code)

    const payload: any = {
      code,
      name: form.value.name,
      rate_to_base: systemRate
    }

    if (isEditing.value && editingId.value !== null) {
      await $fetch(`${BACKEND_API}/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch(BACKEND_API, {
        method: 'POST',
        body: payload
      })
    }

    await loadCurrencies()
    await loadLiveRates()
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save currency', err)
    alert('ไม่สามารถบันทึกสกุลเงินได้')
  }
}

const deleteCurrency = async (cur: any) => {
  if (!confirm(`ต้องการลบ "${cur.code} - ${cur.name}" จริงหรือไม่?`)) return

  try {
    await $fetch(`${BACKEND_API}/${cur.id}`, {
      method: 'DELETE'
    })
    await loadCurrencies()
    await loadLiveRates()
  } catch (err) {
    console.error('Failed to delete currency', err)
    alert('ไม่สามารถลบสกุลเงินได้')
  }
}

// swap from ↔ to ใน converter
const swapFx = () => {
  const from = fxFrom.value
  fxFrom.value = fxTo.value
  fxTo.value = from
}
</script>

<template>
  <div class="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-4 md:px-6 md:py-6">
    <div class="mx-auto w-full max-w-3xl space-y-4 md:space-y-6">
      <!-- ================= HEADER ================= -->
      <div class="space-y-1">
        <h1 class="text-xl font-semibold text-slate-800 md:text-2xl">
          Currency Management
        </h1>
        <p class="text-xs text-slate-500 md:text-sm">
          จัดการสกุลเงิน และดูอัตราแลกเปลี่ยนจาก THB แบบเรียลไทม์
        </p>
        <p v-if="liveError" class="text-[11px] text-red-500">
          {{ liveError }}
        </p>
      </div>

      <!-- ===================================================== -->
      <!-- ============ QUICK FX CONVERTER CARD ============ -->
      <!-- ===================================================== -->
      <div class="rounded-2xl bg-white p-4 md:p-6 shadow-sm space-y-4">
        <div class="space-y-1">
          <h2 class="text-base font-semibold text-slate-800 md:text-lg">
            Quick FX Converter
          </h2>
          <p class="text-xs text-slate-500 md:text-sm">
            เลือกสกุลเงินต้นทาง / ปลายทาง แล้วใส่จำนวนเงิน ระบบจะใช้ค่า
            <span class="font-medium text-emerald-600">live rate</span> ล่าสุดจากตลาด
          </p>
        </div>

        <!-- ---------- แถว Amount ---------- -->
        <div class="grid gap-3 md:grid-cols-[minmax(0,240px)_1fr] md:items-end">
          <div class="space-y-1">
            <label class="block text-xs font-medium text-slate-700 md:text-sm">
              Amount
            </label>
            <input
              v-model.number="fxAmount"
              type="number"
              min="0"
              class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none
                     focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- ======= แถว From / Swap / To (searchable dropdown) ======= -->
        <!-- ===================================================== -->
        <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 md:gap-4 md:items-end">
          <!-- ---------- From dropdown ---------- -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-slate-700 md:text-sm">
              From
            </label>

            <div class="relative">
              <!-- ปุ่มหลัก -->
              <button
                type="button"
                @click="isFromOpen = !isFromOpen"
                class="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm
                       bg-white text-left outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              >
                <span class="flex items-center gap-2">
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs"
                  >
                    {{ getCurrencyIcon(fxFrom) }}
                  </span>
                  <span>
                    {{ fxFrom }} -
                    {{ getCurrencyLabel(fxFrom) || 'Unknown currency' }}
                  </span>
                </span>
                <span class="ml-2 text-xs text-slate-400">▾</span>
              </button>

              <!-- dropdown -->
              <div
                v-if="isFromOpen"
                class="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <div class="border-b border-slate-100 p-2">
                  <input
                    v-model="fromSearch"
                    type="text"
                    class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none
                           focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="ค้นหาด้วย code หรือชื่อประเทศ"
                  />
                </div>

                <div class="max-h-60 overflow-y-auto py-1 text-sm">
                  <button
                    v-for="code in filteredFromCodes"
                    :key="code"
                    type="button"
                    @click="selectFromCode(code)"
                    class="flex w-full items-start px-3 py-1.5 text-left hover:bg-orange-50"
                  >
                    <span
                      class="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs shrink-0"
                    >
                      {{ getCurrencyIcon(code) }}
                    </span>
                    <span class="ml-2 flex flex-col">
                      <span class="font-medium text-slate-800 text-xs md:text-sm">
                        {{ code }}
                      </span>
                      <span class="text-slate-500 text-[11px] md:text-xs">
                        {{ getCurrencyLabel(code) || 'Unknown currency' }}
                      </span>
                    </span>
                  </button>

                  <div
                    v-if="filteredFromCodes.length === 0"
                    class="px-3 py-2 text-xs text-slate-400"
                  >
                    ไม่พบสกุลเงินที่ตรงกับคำค้นหา
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ---------- ปุ่มสลับ ---------- -->
          <div class="flex items-end justify-center pb-1">
            <button
              type="button"
              @click="swapFx"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200
                     text-slate-600 hover:bg-slate-50 active:scale-95"
              title="Swap From / To"
            >
              ⇄
            </button>
          </div>

          <!-- ---------- To dropdown ---------- -->
          <div class="space-y-1">
            <label class="block text-xs font-medium text-slate-700 md:text-sm">
              To
            </label>

            <div class="relative">
              <!-- ปุ่มหลัก -->
              <button
                type="button"
                @click="isToOpen = !isToOpen"
                class="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm
                       bg-white text-left outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              >
                <span class="flex items-center gap-2">
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs"
                  >
                    {{ getCurrencyIcon(fxTo) }}
                  </span>
                  <span>
                    {{ fxTo }} -
                    {{ getCurrencyLabel(fxTo) || 'Unknown currency' }}
                  </span>
                </span>
                <span class="ml-2 text-xs text-slate-400">▾</span>
              </button>

              <!-- dropdown -->
              <div
                v-if="isToOpen"
                class="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <div class="border-b border-slate-100 p-2">
                  <input
                    v-model="toSearch"
                    type="text"
                    class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none
                           focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="ค้นหาด้วย code หรือชื่อประเทศ"
                  />
                </div>

                <div class="max-h-60 overflow-y-auto py-1 text-sm">
                  <button
                    v-for="code in filteredToCodes"
                    :key="code"
                    type="button"
                    @click="selectToCode(code)"
                    class="flex w-full items-start px-3 py-1.5 text-left hover:bg-orange-50"
                  >
                    <span
                      class="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs shrink-0"
                    >
                      {{ getCurrencyIcon(code) }}
                    </span>
                    <span class="ml-2 flex flex-col">
                      <span class="font-medium text-slate-800 text-xs md:text-sm">
                        {{ code }}
                      </span>
                      <span class="text-slate-500 text-[11px] md:text-xs">
                        {{ getCurrencyLabel(code) || 'Unknown currency' }}
                      </span>
                    </span>
                  </button>

                  <div
                    v-if="filteredToCodes.length === 0"
                    class="px-3 py-2 text-xs text-slate-400"
                  >
                    ไม่พบสกุลเงินที่ตรงกับคำค้นหา
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ---------- ปุ่มยอดนิยม ---------- -->
        <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 md:text-xs">
          <span class="mr-1">ยอดนิยม:</span>
          <button
            v-for="code in popularCodes"
            :key="code"
            type="button"
            @click="fxTo = code"
            class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium
                   text-slate-600 hover:border-orange-400 hover:text-orange-500 active:scale-95"
          >
            {{ code }}
            <span v-if="getCurrencyLabel(code)">
              · {{ getCurrencyLabel(code) }}
            </span>
          </button>
        </div>

        <!-- ---------- ผลลัพธ์ ---------- -->
        <div class="mt-1 space-y-1 text-xs md:text-sm">
          <div v-if="fxConverted != null" class="font-semibold text-emerald-600">
            {{ fxAmount || 0 }} {{ fxFrom }} ≈ {{ fxConverted.toFixed(4) }} {{ fxTo }}
          </div>
          <div v-if="fxRateText" class="text-slate-500">
            {{ fxRateText }}
          </div>
          <div v-else class="text-slate-400">
            ยังไม่พบ live rate สำหรับคู่สกุลนี้
          </div>
        </div>
      </div>

      <!-- ===================================================== -->
      <!-- ============ SYSTEM CURRENCIES LIST ============ -->
      <!-- ===================================================== -->
      <div class="rounded-2xl bg-white p-4 md:p-5 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-800 md:text-lg">
            System Currencies
          </h2>
          <button
            type="button"
            @click="openAdd"
            class="inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-xs md:text-sm
                   font-medium text-white shadow hover:bg-orange-600 active:scale-[0.98]"
          >
            + Add Currency
          </button>
        </div>

        <!-- loading / error / empty -->
        <div v-if="isLoading" class="py-8 text-center text-sm text-slate-400">
          กำลังโหลดข้อมูลสกุลเงิน...
        </div>

        <div v-else-if="isError" class="py-8 text-center text-sm text-red-500">
          ไม่สามารถโหลดข้อมูลได้
        </div>

        <div v-else-if="currencies.length === 0" class="py-8 text-center text-sm text-slate-400">
          ยังไม่มีสกุลเงินในระบบ ลองเพิ่มสกุลแรกดูก่อน
        </div>

        <!-- ---------- รายการสกุลเงิน ---------- -->
        <div v-else class="space-y-2 md:space-y-3">
          <div
            v-for="cur in currencies"
            :key="cur.id"
            class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm md:text-base
                   hover:bg-slate-100 transition active:scale-[0.99]"
          >
            <!-- LEFT: Icon + Info -->
            <div class="flex items-start gap-3">
              <span
                class="mt-[1px] flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm"
              >
                {{ getCurrencyIcon(cur.code) }}
              </span>

              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-800">
                    {{ cur.code }}
                  </span>
                  <span class="text-slate-500">
                    - {{ getCurrencyLabel(cur.code) || cur.name }}
                  </span>
                </div>

                <div class="text-[11px] text-slate-500 md:text-xs">
                  <span class="font-medium text-slate-700">System Rate (ต่อ THB):</span>
                  1 {{ cur.code }} =
                  <span class="font-medium">
                    {{ cur.rate_to_base ?? '—' }} THB
                  </span>
                </div>

                <div class="text-[11px] text-emerald-600 md:text-xs">
                  <span class="font-medium">Live Rate:</span>
                  <template v-if="formatLiveRateCodeToTHB(cur.code)">
                    1 {{ cur.code }} ≈
                    {{ formatLiveRateCodeToTHB(cur.code) }} THB
                  </template>
                  <template v-else>
                    ยังไม่มีค่า live rate สำหรับ {{ cur.code }} เทียบกับ THB
                  </template>
                </div>
              </div>
            </div>

            <!-- RIGHT: Actions -->
            <div class="flex items-center gap-3 text-slate-500">
              <button
                @click="openEdit(cur)"
                class="rounded-full p-1.5 hover:bg-white/80 hover:text-slate-700 active:scale-95"
                title="Edit"
              >
                ✎
              </button>
              <button
                @click="deleteCurrency(cur)"
                class="rounded-full p-1.5 hover:bg-white/80 hover:text-red-600 active:scale-95"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- /SYSTEM CURRENCIES -->
    </div>

    <!-- ===================================================== -->
    <!-- ================ MODAL ADD / EDIT ================ -->
    <!-- ===================================================== -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="w-full max-w-md rounded-t-2xl bg-white p-5 pb-6 shadow-xl md:rounded-2xl md:p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-800 md:text-lg">
            {{ isEditing ? 'Edit Currency' : 'Add Currency' }}
          </h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 active:scale-95">
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <!-- CODE -->
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 md:text-sm">
              Currency Code (e.g., USD)
            </label>
            <input
              v-model="form.code"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase outline-none
                     focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="เช่น THB, USD, JPY"
            />
          </div>

          <!-- NAME -->
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 md:text-sm">
              Currency Name
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none
                     focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="ชื่อเต็มของสกุลเงิน (Auto-fill จาก code ได้)"
            />
          </div>

          <!-- preview live rate -->
          <div
            v-if="previewLiveRateForForm"
            class="rounded-lg bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700 md:text-xs"
          >
            Preview จาก live rate:
            <span class="font-semibold">
              1 {{ form.code.toUpperCase() }} ≈ {{ previewLiveRateForForm }} THB
            </span>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="text-xs text-slate-500 hover:text-slate-700 md:text-sm"
          >
            Cancel
          </button>
          <button
            @click="saveCurrency"
            class="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 active:scale-95 md:text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    <!-- /MODAL -->
  </div>
</template>
