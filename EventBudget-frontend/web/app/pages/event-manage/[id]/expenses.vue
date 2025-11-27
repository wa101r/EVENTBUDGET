<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useExpensesApi } from '~/composables/useExpensesApi' 

import ExpenseListItem from '~/components/event/expenses/ExpenseListItem.vue'
import ExpenseFormModal from '~/components/event/expenses/ExpenseFormModal.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'

definePageMeta({
  layout: 'detail',
  title: 'Expenses'
})

const route = useRoute()
const eventId = route.params.id

// ✅ ดึง categories และ getCategories มาใช้
const { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense,
  categories,
  getCategories 
} = useExpensesApi()

// ✅ สั่งโหลดหมวดหมู่ทันที
await getCategories()

const { data: expenses, pending, refresh, error } = await getExpenses(eventId)

const searchQuery = ref('')
const isModalOpen = ref(false)
const editingItem = ref(null)
const isSubmitting = ref(false)

const totalAmount = computed(() => {
  const list = expenses.value || [] 
  return list.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})

const filteredExpenses = computed(() => {
  const list = expenses.value || []
  const q = searchQuery.value.toLowerCase()
  return list.filter(e => 
    e.name.toLowerCase().includes(q) || 
    (e.category && e.category.toLowerCase().includes(q))
  )
})

const openAddModal = () => {
  editingItem.value = null
  isModalOpen.value = true
}

const handleEdit = (item: any) => {
  editingItem.value = { ...item }
  isModalOpen.value = true
}

const handleDelete = async (id: number) => {
  if (!confirm('ยืนยันที่จะลบรายการนี้?')) return
  try {
    await deleteExpense(id)
    refresh()
  } catch (err: any) {
    alert('เกิดข้อผิดพลาด: ' + err)
  }
}

const handleSave = async (formData: any) => {
  isSubmitting.value = true
  try {
    const payload = { ...formData, event_id: eventId }
    if (editingItem.value) {
      await updateExpense(editingItem.value.id, payload)
    } else {
      await createExpense(payload)
    }
    await refresh() 
    isModalOpen.value = false
  } catch (err: any) {
    alert('บันทึกไม่สำเร็จ: ' + err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto space-y-6 pb-24">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Expenses</h1>
      <p class="text-slate-500 text-sm">รายการค่าใช้จ่าย</p>
    </div>

    <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <input v-model="searchQuery" type="text" placeholder="ค้นหารายการ..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
      <div class="flex justify-between items-center px-2 pt-2 border-t border-slate-100">
        <span class="text-slate-500 font-medium">ยอดรวม</span>
        <span class="text-2xl font-bold text-orange-600">
          {{ totalAmount.toLocaleString() }} <span class="text-sm text-slate-400 font-normal">THB</span>
        </span>
      </div>
    </div>

    <div v-if="filteredExpenses.length === 0" class="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
      <p class="text-slate-500 font-medium">ยังไม่มีรายการค่าใช้จ่าย</p>
    </div>
    <div v-else class="space-y-3">
      <ExpenseListItem 
        v-for="expense in filteredExpenses" 
        :key="expense.id" 
        :expense="expense"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <EventFabButton @click="openAddModal" />

    <ExpenseFormModal 
      v-if="isModalOpen"
      :initial-data="editingItem"
      :categories="categories"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>