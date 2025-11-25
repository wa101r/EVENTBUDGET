<script setup>
import {
  formatDate,
  formatMoney,
  getEventName,
  getClientName,
  getStartDate,
  getEndDate,
  getStatusInfo,
  getEventCurrency,
  getEventBaseAmount,
  convertAmount,
} from "~/shared/eventHelpers";

const props = defineProps({
  event: { type: Object, required: true },
  budgetCurrency: { type: String, required: true },
  thbRates: { type: Object, required: true },
});

const emit = defineEmits(["open", "edit", "delete"]);

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);

const mainBudget = computed(() => {
  const amount = getEventBaseAmount(props.event);
  const code = getEventCurrency(props.event);
  return formatMoney(amount, code);
});

const approxBudget = computed(() => {
  const baseAmount = getEventBaseAmount(props.event);
  const baseCode = getEventCurrency(props.event);
  const targetCode = props.budgetCurrency;
  if (targetCode === baseCode) return null;

  const converted = convertAmount(baseAmount, baseCode, targetCode, props.thbRates);
  if (converted == null) return "ยังไม่มี live rate สำหรับสกุลนี้";

  return formatMoney(converted, targetCode);
});

const statusInfo = computed(() => getStatusInfo(props.event));
</script>

<template>
  <div
    @click="emit('open')"
    :class="[
      'cursor-pointer bg-white border border-[#E3EAF3] p-5 sm:p-6 rounded-2xl shadow-sm mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4',
      statusInfo.label === 'Done' ? 'opacity-50 line-through' : ''
    ]"
  >
    <!-- LEFT -->
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <h2 class="text-lg sm:text-xl font-semibold text-[#2B3856]">
          {{ getEventName(event) }}
        </h2>
        <span
          :class="`px-2 py-0.5 text-[10px] rounded-full font-medium ${statusInfo.bg} ${statusInfo.text}`"
        >
          {{ statusInfo.label }}
        </span>
      </div>

      <p class="text-[#3A5BA0] font-medium uppercase text-xs sm:text-sm mt-1 tracking-wide">
        {{ getClientName(event) }}
      </p>

      <div class="flex items-center gap-2 mt-3 text-[#4A5D7A] text-xs sm:text-sm">
        <span class="w-2 h-2 rounded-full bg-[#F47A27] animate-pulse-soft"></span>
        {{ formatDate(getStartDate(event)) }} → {{ formatDate(getEndDate(event)) }}
      </div>

      <!-- Budgets -->
      <div class="mt-2 text-sm">
        <div class="text-green-600 font-semibold flex items-center gap-1">
          <span>💰</span>
          <span>{{ mainBudget }}</span>
        </div>

        <div
          v-if="approxBudget"
          class="mt-0.5 text-[11px] text-slate-500"
        >
          <span class="font-medium">≈</span>
          <span>{{ approxBudget }}</span>
        </div>
      </div>
    </div>

    <!-- RIGHT Actions -->
    <ClientOnly>
      <div class="event-actions relative flex items-center justify-end gap-2" @click.stop>
        <button type="button" class="dots-btn" @click.stop="toggleMenu()">
          <Icon name="ph:dots-three-vertical-bold" size="20" />
        </button>

        <Transition name="fade-scale">
          <div
            v-if="menuOpen"
            class="absolute right-0 top-11 z-20 w-40 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
          >
            <button
              type="button"
              class="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
              @click="emit('edit'); menuOpen=false"
            >
              <Icon name="ph:pencil-simple-bold" size="16" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              class="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
              @click="emit('delete'); menuOpen=false"
            >
              <Icon name="ph:trash-bold" size="16" />
              <span>Delete</span>
            </button>
          </div>
        </Transition>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.dots-btn {
  @apply inline-flex items-center justify-center rounded-full p-1.5 text-slate-900 hover:bg-slate-100 active:scale-95 transition;
  color: #111827;
}
</style>
