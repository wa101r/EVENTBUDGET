import { ref, computed } from 'vue'

// Mock Data รายการค่าใช้จ่าย
const expenses = ref([
  { id: 1, event_id: 1, name: 'ค่าจ้างวิทยากร (Keynote)', amount: 73000, date: '2024-10-28', time: '15:00', category: 'Entertainment', icon: '🎤' },
  { id: 2, event_id: 1, name: 'ค่าอาหารกลางวัน (200 คน)', amount: 120000, date: '2024-10-27', time: '12:30', category: 'Catering', icon: '🍔' },
  { id: 3, event_id: 1, name: 'ค่าเช่าฮอลล์ (BITEC)', amount: 150000, date: '2024-10-26', time: '10:00', category: 'Venue', icon: '🏛️' }
])

// ✅ 1. ต้องประกาศตัวแปร categories ตรงนี้
const categories = ref([
  { id: 1, name: 'Venue', icon: '🏛️' },
  { id: 2, name: 'Catering', icon: '🍔' },
  { id: 3, name: 'Drinks', icon: '🍹' },
  { id: 4, name: 'Entertainment', icon: '🎤' },
  { id: 5, name: 'Marketing', icon: '📢' },
  { id: 6, name: 'Transportation', icon: '🚗' },
  { id: 7, name: 'Decoration', icon: '✨' },
  { id: 8, name: 'Other', icon: '📦' },
])

export const useExpensesApi = () => {
  
  const getExpensesByEventId = (eventId) => {
    return computed(() => expenses.value
      .filter(e => e.event_id === Number(eventId))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    )
  }

  const addExpense = (expense) => {
    const newId = Math.max(0, ...expenses.value.map(e => e.id)) + 1
    const catObj = categories.value.find(c => c.name === expense.category)
    const icon = catObj ? catObj.icon : '🧾'
    expenses.value.push({ ...expense, id: newId, icon })
  }

  const updateExpense = (updatedExpense) => {
    const index = expenses.value.findIndex(e => e.id === updatedExpense.id)
    if (index !== -1) {
        const catObj = categories.value.find(c => c.name === updatedExpense.category)
        const icon = catObj ? catObj.icon : '🧾'
        expenses.value[index] = { ...updatedExpense, icon }
    }
  }

  const removeExpense = (id) => {
    expenses.value = expenses.value.filter(e => e.id !== id)
  }

  const getExpensesByCategory = (eventId) => {
    const eventExpenses = expenses.value.filter(e => e.event_id === Number(eventId))
    const categoryMap = {}
    eventExpenses.forEach(item => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = { name: item.category, amount: 0, icon: item.icon }
      }
      categoryMap[item.category].amount += Number(item.amount)
    })
    return Object.values(categoryMap)
  }

  return {
    expenses,
    categories, // ✅ 2. สำคัญมาก! ต้อง return categories ออกมาด้วย
    getExpensesByEventId,
    addExpense,
    updateExpense,
    removeExpense,
    getExpensesByCategory
  }
}