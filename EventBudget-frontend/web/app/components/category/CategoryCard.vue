<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  cat: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);
</script>

<template>
  <div class="border rounded-lg p-3 bg-white shadow-sm flex flex-col gap-2">
    <!-- ICON -->
    <div class="text-3xl">
      <Icon :icon="props.cat.icon || 'mdi:tag'" />
    </div>

    <!-- NAME -->
    <div class="font-semibold text-gray-900 truncate">
      {{ props.cat.name }}
    </div>

    <!-- ACTIONS -->
    <div class="flex gap-2 mt-2">
      <button
        class="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        @click="emit('edit', props.cat)"
      >
        Edit
      </button>
      <button
        class="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
        @click="emit('delete', props.cat)"
      >
        Delete
      </button>
    </div>
  </div>
</template>
