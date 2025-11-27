import { ref } from 'vue'

export const useExpensesApi = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiBase || 'http://localhost:8000/api'

  // ✅ เพิ่มตัวแปรเก็บหมวดหมู่
  const categories = ref([])

  // ✅ ฟังก์ชันดึงหมวดหมู่จาก Database
  const getCategories = async () => {
    try {
      const data = await $fetch(`${API_URL}/categories`)
      categories.value = data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // --- Expenses Actions ---
  const getExpenses = async (eventId) => {
    return await useFetch(`${API_URL}/events/${eventId}/expenses`, {
      key: `expenses-${eventId}`,
      watch: [ref(eventId)]
    })
  }

  const createExpense = async (data) => {
    return await $fetch(`${API_URL}/expenses`, {
      method: 'POST',
      body: data
    })
  }

  const updateExpense = async (id, data) => {
    return await $fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  const deleteExpense = async (id) => {
    return await $fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE'
    })
  }

  // Helper: แยกหมวดหมู่และดึงไอคอนจาก Categories
  const getExpensesByCategory = (expenseList) => {
    if (!expenseList || expenseList.length === 0) return []
    const categoryMap = {}

    expenseList.forEach(item => {
      const catName = item.category || 'Other'
      
      // แมพไอคอนให้ตรงกับที่ตั้งค่าไว้
      const matchedCat = categories.value.find(c => c.name === catName)
      const icon = matchedCat ? matchedCat.icon : '📦'

      if (!categoryMap[catName]) {
        categoryMap[catName] = { name: catName, amount: 0, icon: icon }
      }
      categoryMap[catName].amount += Number(item.amount)
    })
    return Object.values(categoryMap)
  }

  return {
    categories,       // ส่งออกไปใช้
    getCategories,    // ส่งออกไปใช้
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpensesByCategory
  }
}