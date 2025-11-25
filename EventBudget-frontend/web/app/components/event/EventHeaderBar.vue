<script setup>
import { getCurrencyLabel } from "~/shared/currencyMeta";

defineProps({
  budgetCurrency: { type: String, required: true },
  budgetQuery: { type: String, required: true },
  isBudgetDropdownOpen: { type: Boolean, required: true },
  filteredBudgetCodes: { type: Array, required: true },
  isFxLoading: { type: Boolean, required: true },
  fxError: { type: String, default: null },
});

const emit = defineEmits([
  "toggleBudgetDropdown",
  "setBudgetCurrency",
  "update:budgetQuery",
]);
</script>

<template>
  <div class="mb-3 flex flex-col gap-3">
    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-slate-800 md:text-2xl">
          Event Management
        </h1>
        <p class="text-xs text-slate-500 md:text-sm">
          จัดการงานอีเวนต์ และงบประมาณแบบหลายสกุลเงิน (ต่ออีเวนต์) พร้อม live FX rate
        </p>
      </div>

      <div class="flex flex-col gap-1 text-[11px] text-slate-500 md:text-xs sm:items-end sm:text-right">
        <span class="text-left sm:text-right">
          แสดงงบประมาณโดยประมาณเป็น
        </span>

        <div class="currency-dropdown relative w-full sm:w-auto">
          <button
            type="button"
            @click.stop="emit('toggleBudgetDropdown')"
            class="w-full sm:w-[320px] rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] md:text-xs
                   flex items-center justify-between gap-2 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
          >
            <span class="truncate">
              {{ budgetCurrency }} - {{ getCurrencyLabel(budgetCurrency) || 'Unknown currency' }}
            </span>
            <Icon name="ph:caret-down-bold" size="14" class="shrink-0" />
          </button>

          <Transition name="fade-scale">
            <div
              v-if="isBudgetDropdownOpen"
              class="absolute right-0 mt-2 z-30 w-full sm:w-[320px] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
            >
              <div class="p-2 border-b border-slate-100">
                <input
                  :value="budgetQuery"
                  @input="emit('update:budgetQuery', $event.target.value)"
                  type="text"
                  placeholder="Search currency..."
                  class="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div class="max-h-72 overflow-auto py-1">
                <button
                  v-for="code in filteredBudgetCodes"
                  :key="code"
                  type="button"
                  @click="emit('setBudgetCurrency', code)"
                  class="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between gap-2"
                  :class="code === budgetCurrency ? 'bg-slate-100 font-medium' : ''"
                >
                  <span class="truncate">{{ code }} - {{ getCurrencyLabel(code) || 'Unknown' }}</span>
                  <Icon v-if="code === budgetCurrency" name="ph:check-bold" size="12" />
                </button>

                <p v-if="filteredBudgetCodes.length === 0" class="px-3 py-3 text-xs text-slate-400">
                  ไม่พบสกุลเงินที่ค้นหา
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <p v-if="fxError" class="text-[11px] text-red-500">
      {{ fxError }}
    </p>
    <p v-else-if="isFxLoading" class="text-[11px] text-slate-400">
      กำลังดึง live FX rate สำหรับแปลงงบประมาณ...
    </p>
  </div>
</template>
