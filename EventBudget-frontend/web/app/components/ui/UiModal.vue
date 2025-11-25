<script setup>
const emit = defineEmits(["close"])

const close = () => emit("close")
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
    @click="close"
  >
    <div
      class="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden"
      @click.stop
    >
      <!-- HEADER -->
      <div class="px-6 py-4 border-b border-[#f0ebe5] flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">
          <slot name="title" />
        </h2>
        <button
          class="text-gray-400 text-2xl leading-none hover:text-gray-600"
          @click="close"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <!-- BODY -->
      <div class="px-6 py-5">
        <slot />
      </div>

      <!-- FOOTER -->
      <div v-if="$slots.footer" class="px-6 py-4 border-t border-[#f0ebe5] bg-[#FBFAF8]">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
