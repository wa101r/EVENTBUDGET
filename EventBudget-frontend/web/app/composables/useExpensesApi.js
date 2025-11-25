import { ref, computed } from 'vue'

// State กลางเก็บข้อมูล
const expenses = ref([])

// Mock Categories (ใช้สำหรับเลือก Icon และ Dropdown)
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
  
  // 1. ดึงข้อมูล (Fetch)
  const getExpensesByEventId = (eventId) => {
    // ใช้ computed เพื่อให้หน้าจอ update เมื่อ expenses เปลี่ยน
    const list = computed(() => 
      expenses.value
        .filter(e => e.eventId === Number(eventId))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    )
    
    // เรียก API เพื่อดึงข้อมูลล่าสุด
    $fetch(`/api/expenses?eventId=${eventId}`).then(data => {
      expenses.value = data
    })
    
    return list
  }

  // 2. เพิ่มข้อมูล (Add)
  const addExpense = async (expense) => {
    const newExpense = await $fetch('/api/expenses', { method: 'POST', body: expense })
    expenses.value.unshift(newExpense)
  }

  // 3. ลบข้อมูล (Remove)
  const removeExpense = async (id) => {
    await $fetch(`/api/expenses?id=${id}`, { method: 'DELETE' })
    expenses.value = expenses.value.filter(e => e.id !== id)
  }

  // 4. อัปเดต (Update)
  const updateExpense = async (updatedExpense) => {
    // ถ้ามี API PUT ให้เปิดบรรทัดนี้
    // await $fetch('/api/expenses', { method: 'PUT', body: updatedExpense })
    const index = expenses.value.findIndex(e => e.id === updatedExpense.id)
    if (index !== -1) expenses.value[index] = updatedExpense
  }

  // 5. ✅ ฟังก์ชันที่หายไป: คำนวณยอดตามหมวดหมู่ (สำหรับหน้า Budget)
  const getExpensesByCategory = (eventId) => {
    // กรองเฉพาะ event นี้
    const eventExpenses = expenses.value.filter(e => e.eventId === Number(eventId))
    const categoryMap = {}

    eventExpenses.forEach(item => {
      const catName = item.category || 'Other'
      if (!categoryMap[catName]) {
        // หา icon
        const catDef = categories.value.find(c => c.name === catName)
        categoryMap[catName] = { 
          name: catName, 
          amount: 0, 
          icon: catDef ? catDef.icon : '📦' 
        }
      }
      categoryMap[catName].amount += Number(item.amount)
    })

    return Object.values(categoryMap)
  }

  return {
    expenses,
    categories,
    getExpensesByEventId,
    addExpense,
    removeExpense,
    updateExpense,
    getExpensesByCategory // ✅ Export กลับมาแล้ว
  }
}