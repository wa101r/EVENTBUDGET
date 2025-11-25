<script setup lang="ts">
import { computed } from "vue"
import { getCurrencyFlagUrl } from "~/shared/currencyMeta"

const props = defineProps<{
  code: string
  size?: number  // px
  rounded?: boolean
}>()

const sizePx = computed(() => props.size ?? 28)

const url = computed(() => getCurrencyFlagUrl(props.code, 48)) 
// ขอ 48 เพื่อความคมบนจอ retina

const wrapperStyle = computed(() => ({
  width: `${sizePx.value}px`,
  height: `${sizePx.value}px`,
}))
</script>

<template>
  <span
    class="inline-flex items-center justify-center bg-slate-100 shrink-0 overflow-hidden"
    :class="rounded === false ? 'rounded-md' : 'rounded-full'"
    :style="wrapperStyle"
  >
    <img
      v-if="url"
      :src="url"
      :alt="code"
      class="w-full h-full object-cover"
      loading="lazy"
      referrerpolicy="no-referrer"
    />
    <span v-else class="text-xs">🌐</span>
  </span>
</template>
