<script setup lang="ts">
import { computed, unref } from "vue"
import { currencyMeta, getCurrencyLabel } from "~/shared/currencyMeta"

const props = defineProps<{
  currencies: any[] | any
  isLoading: boolean | any
  isError: boolean | any
  formatLiveRateCodeToThb: (code: string) => string | null
}>()

const emit = defineEmits<{
  (e: "add"): void
  (e: "edit", cur: any): void
  (e: "delete", cur: any): void
}>()

const list = computed(() => (unref(props.currencies) || []) as any[])

const getFlagEmoji = (code: string) =>
  currencyMeta[(code || "").toUpperCase()]?.emoji || "🏳️"
</script>

<template>
  <div class="rounded-3xl bg-white p-4 md:p-5 shadow-sm space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900">
        System Currencies
      </h2>
      <button
        type="button"
        @click="emit('add')"
        class="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow
               hover:bg-orange-600 active:scale-95"
      >
        + Add Currency
      </button>
    </div>

    <div v-if="props.isLoading" class="py-8 text-center text-sm text-slate-400">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else-if="props.isError" class="py-8 text-center text-sm text-red-500">
      โหลดข้อมูลไม่สำเร็จ
    </div>
    <div v-else-if="list.length === 0" class="py-8 text-center text-sm text-slate-400">
      ยังไม่มีสกุลเงินในระบบ
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="cur in list"
        :key="cur.id"
        class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100 transition"
      >
        <div class="flex items-start gap-3 min-w-0">
          <span class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shrink-0">
            {{ getFlagEmoji(cur.code) }}
          </span>

          <div class="min-w-0">
            <div class="font-semibold text-slate-900 truncate">
              {{ cur.code?.toUpperCase() }}
              <span class="font-normal text-slate-500">
                - {{ getCurrencyLabel(cur.code) || cur.name }}
              </span>
            </div>

            <div class="text-[11px] text-slate-600 mt-1">
              1 {{ cur.code?.toUpperCase() }} =
              <span class="font-semibold">{{ cur.rate_to_base ?? "—" }}</span> THB
            </div>

            <div class="text-[11px] text-emerald-700">
              <template v-if="props.formatLiveRateCodeToThb(cur.code)">
                Live: 1 {{ cur.code?.toUpperCase() }} ≈
                {{ props.formatLiveRateCodeToThb(cur.code) }} THB
              </template>
              <template v-else>
                Live: —
              </template>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 text-slate-500 shrink-0">
          <button
            class="p-2 rounded-full hover:bg-white hover:text-slate-800 active:scale-95"
            title="Edit"
            @click="emit('edit', cur)"
          >
            ✎
          </button>
          <button
            class="p-2 rounded-full hover:bg-white hover:text-red-600 active:scale-95"
            title="Delete"
            @click="emit('delete', cur)"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
