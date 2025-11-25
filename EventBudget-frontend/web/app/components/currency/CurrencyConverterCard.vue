<script setup lang="ts">
import { computed, ref, watch } from "vue"
import CurrencySelectDropdown from "~/components/currency/CurrencySelectDropdown.vue"

// เพิ่มบรรทัดนี้ใน script setup
const rotation = ref(0)

const handleSwap = () => {
  // 1. สั่งหมุนเพิ่มทีละ 180 องศา
  rotation.value += 180

  // 2. สั่ง emit ทำงานเดิม
  emit('swap')
}

const props = defineProps<{
  fxAmount: number
  fxFrom: string
  fxTo: string
  fxConverted: number | null
  fxRateText: string | null
  popularCodes: string[]
  fromSearch: string
  toSearch: string
  isFromOpen: boolean
  isToOpen: boolean
  filteredFromCodes: string[]
  filteredToCodes: string[]
}>()

const emit = defineEmits([
  "update:fxAmount",
  "update:fxFrom",
  "update:fxTo",
  "update:fromSearch",
  "update:toSearch",
  "update:isFromOpen",
  "update:isToOpen",
  "swap",
  "pickPopular",
])

const amountVal = ref(props.fxAmount)
watch(() => props.fxAmount, v => amountVal.value = v)
watch(amountVal, v => emit("update:fxAmount", v))

const convertedText = computed(() =>
  props.fxConverted == null
    ? "-"
    : props.fxConverted.toLocaleString("th-TH", { maximumFractionDigits: 2 })
)
</script>

<template>
  <div class="rounded-3xl bg-white p-4 md:p-6 shadow-sm space-y-4">
    <div class="text-center space-y-1">
      <div class="text-xs text-slate-500">อัตราแลกเปลี่ยนกลางของตลาด</div>
      <div class="text-sm font-semibold text-slate-900">
        {{ props.fxRateText || "-" }}
      </div>
    </div>

    <!-- FROM ROW -->
    <div
      class="relative rounded-2xl border border-slate-200 bg-white px-3 py-2 flex items-center gap-3 overflow-visible">
      <input v-model.number="amountVal" type="number" min="0" class="flex-1 min-w-0 text-2xl font-semibold outline-none bg-transparent
               pr-[150px] sm:pr-[170px]" placeholder="0" />

      <!-- dropdown ฝังในกรอบเลข -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2 w-[135px] sm:w-[160px]">
        <CurrencySelectDropdown :model-value="props.fxFrom" :codes="props.filteredFromCodes" :search="props.fromSearch"
          :is-open="props.isFromOpen" placeholder="ค้นหา..." @update:modelValue="emit('update:fxFrom', $event)"
          @update:search="emit('update:fromSearch', $event)" @update:isOpen="emit('update:isFromOpen', $event)" />
      </div>
    </div>

    <!-- SWAP -->
    <div class="flex justify-center">
      <button type="button" @click="handleSwap" class="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm
         hover:bg-orange-200 active:scale-95 transition-all duration-300 ease-in-out"
        :style="{ transform: `rotate(${rotation}deg)` }" title="swap">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
        </svg>
      </button>
    </div>

    <!-- TO ROW -->
    <div
      class="relative rounded-2xl border border-slate-200 bg-white px-3 py-2 flex items-center gap-3 overflow-visible">
      <input :value="convertedText" readonly class="flex-1 min-w-0 text-2xl font-semibold outline-none bg-transparent text-slate-900
               pr-[150px] sm:pr-[170px]" />

      <div class="absolute right-2 top-1/2 -translate-y-1/2 w-[135px] sm:w-[160px]">
        <CurrencySelectDropdown :model-value="props.fxTo" :codes="props.filteredToCodes" :search="props.toSearch"
          :is-open="props.isToOpen" placeholder="ค้นหา..." @update:modelValue="emit('update:fxTo', $event)"
          @update:search="emit('update:toSearch', $event)" @update:isOpen="emit('update:isToOpen', $event)" />
      </div>
    </div>

    <!-- POPULAR -->
    <div class="pt-1">
      <div class="text-[11px] text-slate-500 mb-2">ยอดนิยม:</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="c in props.popularCodes" :key="c" type="button" class="px-3 py-1 rounded-full border border-slate-200 text-xs font-medium text-slate-700
                 hover:border-orange-400 hover:text-orange-500 active:scale-95 transition"
          @click="emit('pickPopular', c)">
          {{ c }}
        </button>
      </div>
    </div>
  </div>
</template>
