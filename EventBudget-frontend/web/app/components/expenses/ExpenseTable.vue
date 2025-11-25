<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] }
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
  <div class="overflow-x-auto bg-white border border-[#eee7df] rounded-3xl shadow-sm">
    <table class="min-w-full text-sm">
      <thead class="bg-[#FBF7F2] text-gray-600">
        <tr>
          <th class="px-5 py-3 text-left">Name</th>
          <th class="px-5 py-3 text-left">Category</th>
          <th class="px-5 py-3 text-left">Date</th>
          <th class="px-5 py-3 text-right">Amount</th>
          <th class="px-5 py-3 text-right">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="exp in items"
          :key="exp.id"
          class="border-b last:border-0 hover:bg-[#FFFDFC] transition"
        >
          <td class="px-5 py-3 font-medium text-gray-900">
            {{ exp.name }}
          </td>

          <td class="px-5 py-3">
            <span
              class="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF2D9] text-[#C0661B]"
            >
              {{ exp.category || "Uncategorized" }}
            </span>
          </td>

          <td class="px-5 py-3 text-gray-600">
            {{ formatDate(exp.date) }}
            <span v-if="exp.time" class="text-xs text-gray-400">
              ({{ exp.time }})
            </span>
          </td>

          <td class="px-5 py-3 text-right font-bold text-[#1f2937]">
            {{ formatMoney(exp.amount) }}
          </td>

          <td class="px-5 py-3 text-right flex justify-end gap-2">
            <button
              class="px-3 py-1.5 text-xs rounded-full bg-[#F3F4F6] text-gray-700 hover:bg-[#EDEFF2]"
              @click="$emit('edit', exp)"
            >
              ✏️ Edit
            </button>

            <button
              class="px-3 py-1.5 text-xs rounded-full bg-[#FFE5E5] text-red-700 hover:bg-[#FFD3D3]"
              @click="$emit('delete', exp.id)"
            >
              🗑 Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
