<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'header',
  title: 'Currency Management'
})

// -------------------- CONFIG --------------------
const BACKEND_API = 'http://127.0.0.1:8000/api/currencies'

// 👉 ใส่ API KEY ของ ExchangeRate-API ตรงนี้
const EXCHANGE_API_KEY = '02870fb2d04e8c1f3ff3690e'
const EXCHANGE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`

// -------------------- STATE หลัก --------------------
const currenciesRaw = ref<any[]>([])
const isLoading = ref(true)
const isError = ref(false)

// live rate: 1 THB = x CODE  (เช่น { USD: 0.0308, JPY: 4.8, ... })
const thbRates = ref<Record<string, number>>({})
const isLiveLoading = ref(false)
const liveError = ref<string | null>(null)

// ------- QUICK FX CONVERTER (ไป–กลับ) -------
const fxAmount = ref(1000)
const fxFrom = ref('THB')
const fxTo = ref('USD')

// modal CRUD
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  code: '',
  name: ''
})

// -------------------- HELPERS --------------------
const currencies = computed(() =>
  currenciesRaw.value.map((c) => ({
    ...c,
    code: (c.code || '').toUpperCase()
  }))
)

const allCodes = computed(() => currencies.value.map((c) => c.code))

// code ที่ให้เลือกใน dropdown (มี THB เพิ่มให้แน่ ๆ)
const selectableCodes = computed(() => {
  const set = new Set<string>(['THB', ...allCodes.value])
  return Array.from(set)
})

// code ทั้งหมดที่มี live rate (ใช้กับ converter)
const converterCodes = computed(() => {
  const set = new Set<string>(['THB', ...Object.keys(thbRates.value)])
  return Array.from(set).sort()
})

// ประเทศยอดนิยม (ปุ่มลัด)
const popularPreset = ['JPY', 'KRW', 'CNY', 'USD', 'EUR']
const popularCodes = computed(() =>
  popularPreset.filter((c) => converterCodes.value.includes(c))
)

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
  // r = 1 THB = r CODE  →  1 CODE = 1/r THB
  return 1 / r
}

// ใช้แสดงใน UI: 1 CODE ≈ x THB (จาก live rate)
const formatLiveRateCodeToTHB = (code: string): string | null => {
  const r = getRateTHBTo(code)
  if (!r) return null
  const codeToThb = 1 / r
  return codeToThb.toFixed(4)
}

// คำนวณอัตราแลกเปลี่ยนทั่วไป: 1 from = ? to
const calcRate = (from: string, to: string): number | null => {
  if (!from || !to) return null
  from = from.toUpperCase()
  to = to.toUpperCase()
  if (from === to) return 1

  const map = thbRates.value as Record<string, number>

  // map: 1 THB = map[CODE]
  // 1 CODE = 1 / map[CODE] THB
  const fromToThb =
    from === 'THB' ? 1 : (map[from] ? 1 / map[from] : null) // 1 from = ? THB
  const thbToTo = to === 'THB' ? 1 : map[to] || null        // 1 THB = ? to

  if (!fromToThb || !thbToTo) return null

  // 1 from = (THB) * (THB -> to)
  return fromToThb * thbToTo
}

// rate ปัจจุบันของ quick converter
const fxRate = computed(() => calcRate(fxFrom.value, fxTo.value))

// จำนวนเงินที่แลกได้
const fxConverted = computed(() => {
  const r = fxRate.value
  if (r == null) return null
  return fxAmount.value * r
})

// text แสดง rate 1 from → to
const fxRateText = computed(() => {
  if (fxRate.value == null) return null
  return `1 ${fxFrom.value} ≈ ${fxRate.value.toFixed(4)} ${fxTo.value}`
})

// -------------------- LOAD BACKEND --------------------
const loadCurrencies = async () => {
  try {
    isLoading.value = true
    isError.value = false
    const res: any = await $fetch(BACKEND_API)
    currenciesRaw.value = res?.data ?? res ?? []

    // ให้ fxTo เป็นสกุลแรกถ้า USD ไม่มีในระบบ
    if (currencies.value.length > 0 && !converterCodes.value.includes(fxTo.value)) {
      fxTo.value = currencies.value[0].code
    }
  } catch (err) {
    console.error('Failed to load currencies', err)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

// -------------------- LOAD LIVE RATES (THB base) --------------------
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

    // ทำให้ได้ 1 THB = ? CODE
    for (const code of Object.keys(conv)) {
      if (code === 'THB') {
        result['THB'] = 1
        continue
      }
      // จาก API:
      // 1 USD = conv[code] CODE
      // 1 USD = usdToThb THB
      // ⇒ 1 THB = (conv[code] / usdToThb) CODE
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

// -------------------- CRUD --------------------
const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    code: '',
    name: ''
  }
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

    // ให้ API เป็นคนกำหนด rate (1 CODE = ? THB จาก live rate)
    const systemRate = getSystemRateToTHB(code)

    const payload: any = {
      code,
      name: form.value.name,
      rate_to_base: systemRate // อาจจะเป็น null ถ้าไม่มี live rate
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
      <!-- HEADER -->
      <div class="space-y-1">
        <h1 class="text-xl font-semibold text-slate-800 md:text-2xl">
          Currency Management
        </h1>
        <p class="text-xs text-slate-500 md:text-sm">
          จัดการสกุลเงิน และดูอัตราแลกเปลี่ยนจาก
          <span class="font-semibold text-orange-500">THB</span>
          แบบเรียลไทม์
        </p>
        <p v-if="liveError" class="text-[11px] text-red-500">
          {{ liveError }}
        </p>
      </div>

      <!-- QUICK FX CONVERTER -->
      <div class="rounded-2xl bg-white p-4 shadow-sm md:p-5">
        <h2 class="text-sm font-semibold text-slate-800 md:text-base">
          Quick FX Converter
        </h2>
        <p class="mt-1 text-[11px] text-slate-500 md:text-xs">
          เลือกสกุลต้นทาง/ปลายทางแล้วใส่จำนวนเงิน ระบบจะใช้ค่า
          <span class="font-semibold text-emerald-600">live rate</span>
          ล่าสุดจากตลาด
        </p>

        <div class="mt-4 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
          <!-- Amount -->
          <div>
            <label class="mb-1 block text-[11px] font-medium text-slate-700 md:text-xs">
              Amount
            </label>
            <input
              v-model.number="fxAmount"
              type="number"
              min="0"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </div>

          <!-- From -->
          <div>
            <label class="mb-1 block text-[11px] font-medium text-slate-700 md:text-xs">
              From
            </label>
            <select
              v-model="fxFrom"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            >
              <option
                v-for="code in converterCodes"
                :key="'from-' + code"
                :value="code"
              >
                {{ code }}
              </option>
            </select>
          </div>

          <!-- To -->
          <div>
            <label class="mb-1 block text-[11px] font-medium text-slate-700 md:text-xs">
              To
            </label>
            <select
              v-model="fxTo"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            >
              <option
                v-for="code in converterCodes"
                :key="'to-' + code"
                :value="code"
              >
                {{ code }}
              </option>
            </select>
          </div>

          <!-- Swap -->
          <button
            type="button"
            @click="swapFx"
            class="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 md:mt-6"
            title="Swap"
          >
            ⇄
          </button>
        </div>

        <!-- Preset -->
        <div
          v-if="popularCodes.length"
          class="mt-3 flex flex-wrap items-center gap-2 text-[11px] md:text-xs"
        >
          <span class="text-slate-500">ยอดนิยม:</span>
          <button
            v-for="code in popularCodes"
            :key="'pop-' + code"
            type="button"
            @click="fxFrom = 'THB'; fxTo = code"
            class="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:border-orange-400 hover:text-orange-500 active:scale-95"
          >
            THB → {{ code }}
          </button>
        </div>

        <!-- Result -->
        <div class="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700 md:text-xs">
          <div v-if="fxConverted != null && fxRate != null">
            <div class="font-medium text-slate-800">
              {{ fxAmount }} {{ fxFrom }} ≈
              <span class="text-emerald-600">
                {{ fxConverted.toFixed(4) }} {{ fxTo }}
              </span>
            </div>
            <div class="mt-1 text-slate-500">
              {{ fxRateText }}
            </div>
          </div>
          <div v-else>
            ยังไม่มีค่า live rate สำหรับคู่สกุลเงินที่เลือก
          </div>
        </div>
      </div>

      <!-- SYSTEM CURRENCIES -->
      <div class="rounded-2xl bg-white p-3 shadow-sm md:p-4 min-h-[200px] flex flex-col">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-800 md:text-base">
            System Currencies
          </h2>
          <button
            type="button"
            @click="openAdd"
            class="inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-xs font-medium text-white shadow hover:bg-orange-600 active:scale-95 md:text-sm"
          >
            + Add Currency
          </button>
        </div>

        <div v-if="isLoading" class="flex-1 py-6 text-center text-sm text-slate-400">
          กำลังโหลดข้อมูลสกุลเงิน...
        </div>

        <div v-else-if="isError" class="flex-1 py-6 text-center text-sm text-red-500">
          ไม่สามารถโหลดข้อมูลได้
        </div>

        <div
          v-else-if="currencies.length === 0"
          class="flex-1 py-6 text-center text-sm text-slate-400"
        >
          ยังไม่มีสกุลเงินในระบบ ลองเพิ่มสกุลแรกดูก่อน
        </div>

        <div v-else class="flex-1 space-y-2 overflow-y-auto pt-1 md:space-y-3 md:pt-2">
          <div
            v-for="cur in currencies"
            :key="cur.id"
            class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm md:text-base hover:bg-slate-100 transition active:scale-[0.99]"
          >
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-800">
                  {{ cur.code }}
                </span>
                <span class="text-slate-500">
                  - {{ cur.name }}
                </span>
              </div>

              <!-- System Rate -->
              <div class="mt-1 text-[11px] text-slate-500 md:text-xs">
                <span class="font-medium text-slate-700">System Rate (ต่อ THB):</span>
                1 {{ cur.code }} =
                {{ cur.rate_to_base ?? '—' }} THB
              </div>

              <!-- Live Rate 1 CODE -> THB -->
              <div
                v-if="formatLiveRateCodeToTHB(cur.code)"
                class="mt-0.5 text-[11px] text-emerald-600 md:text-xs"
              >
                <span class="font-medium">Live Rate:</span>
                1 {{ cur.code }} ≈
                {{ formatLiveRateCodeToTHB(cur.code) }}
                THB
              </div>
              <div
                v-else
                class="mt-0.5 text-[11px] text-slate-400 md:text-xs"
              >
                ยังไม่มีค่า live rate สำหรับ {{ cur.code }} เทียบกับ THB
              </div>
            </div>

            <div class="flex items-center gap-3 text-slate-500">
              <button
                type="button"
                @click="openEdit(cur)"
                class="rounded-full p-1.5 hover:bg-white/80 hover:text-slate-700 active:scale-95"
                title="Edit"
              >
                ✎
              </button>
              <button
                type="button"
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
    </div>

    <!-- MODAL -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="w-full max-w-md rounded-t-2xl bg-white p-5 pb-6 shadow-xl md:rounded-2xl md:p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-800 md:text-lg">
            {{ isEditing ? 'Edit Currency' : 'Add Currency' }}
          </h2>
          <button
            type="button"
            @click="closeModal"
            class="text-slate-400 hover:text-slate-600 active:scale-95"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 md:text-sm">
              Currency Code (e.g., USD)
            </label>
            <input
              v-model="form.code"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="เช่น THB, USD, EUR"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 md:text-sm">
              Currency Name (e.g., US Dollar)
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="ชื่อเต็มของสกุลเงิน"
            />
          </div>

          <!-- Preview จาก live rate -->
          <div class="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600 md:text-xs">
            <div class="font-medium text-slate-700 mb-1">
              Preview จาก live rate
            </div>
            <div v-if="formatLiveRateCodeToTHB(form.code)">
              1 {{ form.code.toUpperCase() }} ≈
              <span class="text-emerald-600 font-medium">
                {{ formatLiveRateCodeToTHB(form.code) }}
              </span>
              THB
            </div>
            <div v-else>
              ยังไม่พบ live rate สำหรับ
              <span class="font-medium">
                {{ form.code ? form.code.toUpperCase() : 'สกุลนี้' }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-3">
          <button
            type="button"
            @click="closeModal"
            class="text-xs text-slate-500 hover:text-slate-700 md:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveCurrency"
            class="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 active:scale-95 md:text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
