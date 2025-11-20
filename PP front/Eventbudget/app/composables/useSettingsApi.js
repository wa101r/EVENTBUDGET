import { ref } from 'vue'

// --- Mock Data (อิงตาม SQL Dump ของคุณ) ---
const categories = ref([
  { id: 1, name: 'Catering', icon: '🍔' },
  { id: 2, name: 'Decorations', icon: '🎉' },
  { id: 3, name: 'Drinks', icon: '🍹' },
  { id: 4, name: 'Entertainment', icon: '🎤' },
  { id: 5, name: 'Food', icon: '🍎' },
  { id: 6, name: 'Marketing', icon: '📢' },
  { id: 7, name: 'Transportation', icon: '🚗' },
  { id: 8, name: 'Venue', icon: '🏛️' },
  { id: 9, name: 'Other', icon: '📦' },
])

const currencies = ref([
  { id: 1, code: 'THB', name: 'Thai Baht', rate_to_base: 1.0000, is_base_currency: true },
  { id: 2, code: 'USD', name: 'US Dollar', rate_to_base: 36.5000, is_base_currency: false },
  { id: 3, code: 'EUR', name: 'Euro', rate_to_base: 39.5000, is_base_currency: false },
])

const teamMembers = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0812345678' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0898765432' },
])

export const useSettingsApi = () => {
  
  // --- Categories Logic ---
  const createCategory = (data) => {
    const newId = Math.max(0, ...categories.value.map(c => c.id)) + 1
    categories.value.push({ ...data, id: newId })
    alert('เพิ่มหมวดหมู่สำเร็จ!')
  }
  const updateCategory = (id, data) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) categories.value[index] = { ...data, id }
    alert('แก้ไขหมวดหมู่สำเร็จ!')
  }
  const deleteCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id)
    alert('ลบหมวดหมู่สำเร็จ!')
  }

  // --- Currencies Logic ---
  const createCurrency = (data) => {
    const newId = Math.max(0, ...currencies.value.map(c => c.id)) + 1
    currencies.value.push({ ...data, id: newId })
    alert('เพิ่มสกุลเงินสำเร็จ!')
  }
  const updateCurrency = (id, data) => {
    const index = currencies.value.findIndex(c => c.id === id)
    if (index !== -1) currencies.value[index] = { ...data, id }
    alert('แก้ไขสกุลเงินสำเร็จ!')
  }
  const deleteCurrency = (id) => {
    currencies.value = currencies.value.filter(c => c.id !== id)
    alert('ลบสกุลเงินสำเร็จ!')
  }

  // --- Team Logic ---
  const createTeamMember = (data) => {
    const newId = Math.max(0, ...teamMembers.value.map(t => t.id)) + 1
    teamMembers.value.push({ ...data, id: newId })
    alert('เพิ่มสมาชิกทีมสำเร็จ!')
  }
  const updateTeamMember = (id, data) => {
    const index = teamMembers.value.findIndex(t => t.id === id)
    if (index !== -1) teamMembers.value[index] = { ...data, id }
    alert('แก้ไขสมาชิกทีมสำเร็จ!')
  }
  const deleteTeamMember = (id) => {
    teamMembers.value = teamMembers.value.filter(t => t.id !== id)
    alert('ลบสมาชิกทีมสำเร็จ!')
  }

  return {
    categories, createCategory, updateCategory, deleteCategory,
    currencies, createCurrency, updateCurrency, deleteCurrency,
    teamMembers, createTeamMember, updateTeamMember, deleteTeamMember
  }
}