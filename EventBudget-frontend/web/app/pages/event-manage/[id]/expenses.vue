<script setup>
import ExpenseTable from "~/components/expenses/ExpenseTable.vue"
import UiModal from "~/components/ui/UiModal.vue"
import UiInput from "~/components/ui/UiInput.vue"
import UiButton from "~/components/ui/UiButton.vue"
import EventFabButton from "~/components/event/EventFabButton.vue"
import EventTabBar from "~/components/layout/EventTabBar.vue"
import { useExpensesApi } from "~/composables/useExpensesApi"

definePageMeta({
  layout: "header",
  title: "Expenses",
})

const route = useRoute()
const eventId = computed(() => Number(route.params.id))

const {
  getExpensesByEventId,
  addExpense,
  updateExpense,
  removeExpense,
  categories,
} = useExpensesApi()

// ✅ ให้ reactive ตาม eventId
const expensesRef = computed(() => getExpensesByEventId(eventId.value))

// ----- UI state -----
const search = ref("")
const isModalOpen = ref(false)
const isEditing = ref(false)

const form = ref({
  id: null,
  name: "",
  amount: null,
  date: "",
  time: "",
  category: "",
})

const resetForm = () => {
  form.value = {
    id: null,
    name: "",
    amount: null,
    date: "",
    time: "",
    category: "",
  }
}

const openAdd = () => {
  resetForm()
  isEditing.value = false
  isModalOpen.value = true
}

const openEdit = (exp) => {
  form.value = {
    id: exp.id,
    name: exp.name,
    amount: exp.amount,
    date: exp.date,
    time: exp.time,
    category: exp.category,
  }
  isEditing.value = true
  isModalOpen.value = true
}

const handleSave = async () => {
  const payload = { ...form.value, eventId: eventId.value }
  if (isEditing.value) {
    await updateExpense(payload)
  } else {
    await addExpense(payload)
  }
  isModalOpen.value = false
}

const handleDelete = async (id) => {
  if (confirm("ลบค่าใช้จ่ายนี้?")) {
    await removeExpense(id)
  }
}

// ----- computed -----
const expenses = computed(() => expensesRef.value?.value ?? [])

const filteredExpenses = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return expenses.value
  return expenses.value.filter(e =>
    (e.name || "").toLowerCase().includes(q) ||
    (e.category || "").toLowerCase().includes(q)
  )
})

const totalAmount = computed(() =>
  expenses.value.reduce((s, e) => s + Number(e.amount || 0), 0)
)
</script>

<template>
  <!-- ✅ ใส่พื้นหลัง Dinsor เบา ๆ -->
  <div class="min-h-screen bg-[#F8F6F3] pb-24">
    <div class="px-4 sm:px-6 py-5 space-y-4">
      <!-- HEADER BAR -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[#1f2937]">Expenses</h1>
          <p class="text-sm text-gray-500">รายการค่าใช้จ่ายของอีเว้นนี้</p>
        </div>

        <!-- desktop add -->
        <UiButton class="hidden sm:inline-flex" @click="openAdd">
          + Add
        </UiButton>
      </div>

      <!-- SEARCH + TOTAL -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <UiInput
          v-model="search"
          placeholder="Search expenses..."
          class="md:col-span-2"
        />

        <div class="bg-white rounded-2xl border border-[#eee7df] px-4 py-3 flex items-center justify-between shadow-sm">
          <div class="text-sm text-gray-500">Total</div>
          <div class="text-lg font-bold text-green-600">
            {{ totalAmount.toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- EMPTY -->
      <div
        v-if="!filteredExpenses.length"
        class="bg-white/70 border border-dashed border-[#e9e2da] rounded-3xl p-10 text-center"
      >
        <div class="text-5xl mb-2">🧾</div>
        <div class="font-semibold text-gray-700">No expenses yet</div>
        <UiButton class="mt-4" @click="openAdd">
          + Add expense
        </UiButton>
      </div>

      <!-- LIST / TABLE -->
      <div v-else>
        <ExpenseTable
          :items="filteredExpenses"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </div>

      <!-- floating add (mobile) -->
      <EventFabButton class="sm:hidden fixed right-5 bottom-24" @click="openAdd" />
      <!-- ↑ bottom-24 กันชน tabbar -->
    </div>

    <!-- MODAL -->
    <UiModal v-if="isModalOpen" @close="isModalOpen = false">
      <template #title>
        {{ isEditing ? "Edit Expense" : "Add Expense" }}
      </template>

      <div class="space-y-3">
        <UiInput v-model="form.name" label="Name" />
        <UiInput v-model="form.amount" label="Amount" type="number" />

        <div>
          <label class="text-sm text-gray-600 block mb-1">Category</label>
          <select v-model="form.category" class="w-full p-3 rounded-xl bg-gray-100">
            <option value="">Select category</option>
            <option v-for="c in categories.value" :key="c.id" :value="c.name">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UiInput v-model="form.date" label="Date" type="date" />
          <UiInput v-model="form.time" label="Time" type="time" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="secondary" @click="isModalOpen = false">Cancel</UiButton>
          <UiButton variant="primary" @click="handleSave">Save</UiButton>
        </div>
      </template>
    </UiModal>

    <!-- ✅ TAB BAR ล่าง -->
    <EventTabBar :event-id="eventId" />
  </div>
</template>
