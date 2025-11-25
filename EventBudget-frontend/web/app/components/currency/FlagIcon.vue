<template>
  <img
    v-if="url"
    :src="url"
    alt="flag"
    class="w-7 h-7 rounded-full object-cover shadow-sm border border-gray-200"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  iso2?: string | null;
}>();

// ถ้า iso2 = "US" → https://cdn.jsdelivr.net/gh/twitter/twemoji/...
const url = computed(() => {
  if (!props.iso2) return null;
  const code = props.iso2.toLowerCase();
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`;
});
</script>
