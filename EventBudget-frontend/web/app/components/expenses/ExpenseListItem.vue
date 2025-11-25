<script setup>
const props = defineProps({
  expense: { type: Object, required: true }
})

const emit = defineEmits(["edit", "delete"])

const formatMoney = (n) =>
  Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0 })

const formatDate = (d) => {
  if (!d) return "-"
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  } catch {
    return d
  }
}
</script>

<template>
  <div
    class="bg-white hover:bg-[#FFFDFC] transition rounded-3xl border border-[#eee7df] shadow-sm p-4 flex flex-col gap-3"
  >
    <!-- TOP ROW -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-gray-900 truncate">
          {{ expense.name }}
        </div>

        <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
          <span>📅 {{ formatDate(expense.date) }}</span>
          <span v-if="expense.time">• ⏰ {{ expense.time }}</span>
        </div>
      </div>

      <!-- Amount -->
      <div class="text-right shrink-0">
        <div class="text-lg font-bold text-[#1f2937]">
          {{ formatMoney(expense.amount) }}
        </div>
        <div class="text-xs text-gray-400">THB</div>
      </div>
    </div>

    <!-- CATEGORY PILL -->
    <div>
      <span
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF2D9] text-[#C0661B]"
      >
        {{ expense.category || "Uncategorized" }}
      </span>
    </div>

    <!-- ACTIONS -->
    <div class="flex justify-end gap-2 pt-1">
      <button
        class="px-3 py-1.5 text-xs rounded-full bg-[#F3F4F6] text-gray-700 hover:bg-[#EDEFF2]"
        @click="$emit('edit', expense)"
      >
        ✏️ Edit
      </button>
      <button
        class="px-3 py-1.5 text-xs rounded-full bg-[#FFE5E5] text-red-700 hover:bg-[#FFD3D3]"
        @click="$emit('delete', expense.id)"
      >
        🗑 Delete
      </button>
    </div>
  </div>
</template>
