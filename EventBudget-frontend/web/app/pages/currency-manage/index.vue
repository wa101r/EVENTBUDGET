<script setup lang="ts">
import CurrencyConverterCard from "~/components/currency/CurrencyConverterCard.vue"
import SystemCurrencyList from "~/components/currency/SystemCurrencyList.vue"
import CurrencyFormModal from "~/components/currency/CurrencyFormModal.vue"
import { useCurrencyManage } from "~/composables/useCurrencyManage"

definePageMeta({
  layout: "header",
  title: "Currency Management",
})

const {
  // list / live
  currencies, isLoading, isError, liveError,
  formatLiveRateCodeToTHB,

  // converter
  fxAmount, fxFrom, fxTo, fxConverted, fxRateText,
  popularCodes,
  fromSearch, toSearch, isFromOpen, isToOpen,
  filteredFromCodes, filteredToCodes,
  swapFx,

  // modal crud
  isModalOpen, isEditing, form, previewLiveRateForForm,
  openAdd, openEdit, closeModal, saveCurrency, deleteCurrency,
} = useCurrencyManage()
</script>

<template>
  <div class="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-5 md:px-6">
    <div class="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800">Currency Management</h1>
        <p class="text-sm text-slate-500">จัดการสกุลเงิน และแปลงเงินแบบเรียลไทม์</p>
        <p v-if="liveError" class="text-xs text-red-500 mt-1">{{ liveError }}</p>
      </div>

      <CurrencyConverterCard
        :fx-amount="fxAmount"
        :fx-from="fxFrom"
        :fx-to="fxTo"
        :fx-converted="fxConverted"
        :fx-rate-text="fxRateText"
        :popular-codes="popularCodes"
        :from-search="fromSearch"
        :to-search="toSearch"
        :is-from-open="isFromOpen"
        :is-to-open="isToOpen"
        :filtered-from-codes="filteredFromCodes"
        :filtered-to-codes="filteredToCodes"
        @update:fxAmount="fxAmount = $event"
        @update:fxFrom="fxFrom = $event"
        @update:fxTo="fxTo = $event"
        @update:fromSearch="fromSearch = $event"
        @update:toSearch="toSearch = $event"
        @update:isFromOpen="isFromOpen = $event"
        @update:isToOpen="isToOpen = $event"
        @swap="swapFx"
        @pickPopular="fxTo = $event"
      />

      <SystemCurrencyList
        :currencies="currencies"
        :is-loading="isLoading"
        :is-error="isError"
        :format-live-rate-code-to-thb="formatLiveRateCodeToTHB"
        @add="openAdd"
        @edit="openEdit"
        @delete="deleteCurrency"
      />
    </div>

    <CurrencyFormModal
      :is-open="isModalOpen"
      :is-editing="isEditing"
      :form="form"
      :preview-live-rate-for-form="previewLiveRateForForm"
      @close="closeModal"
      @save="saveCurrency"
      @update:form="form = $event"
    />
  </div>
</template>
