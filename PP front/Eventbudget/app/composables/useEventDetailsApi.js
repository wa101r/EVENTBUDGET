import { ref, computed } from 'vue'

// --- Mock Data (อิงตาม SQL Dump) ---
const expenses = ref([
  { id: 1, event_id: 1, name: 'Keynote Speaker Fee', amount: 73000, date: '2024-10-28', time: '15:00', category: 'Entertainment' },
  { id: 2, event_id: 1, name: 'Lunch for attendees', amount: 80000, date: '2024-10-27', time: '12:30', category: 'Catering' },
])

const tasks = ref([
  { id: 1, event_id: 1, title: 'Order merchandise', description: 'Shirts & Notebooks', due_date: '2024-11-20', is_completed: false },
  { id: 2, event_id: 1, title: 'Finalize speakers', description: 'Confirm topics', due_date: '2024-11-15', is_completed: true },
])

const timelineItems = ref([
  { id: 1, event_id: 1, title: 'Registration', description: 'Lobby A', date: '2024-10-26', start_time: '08:00', end_time: '09:00' },
  { id: 2, event_id: 1, title: 'Opening Ceremony', description: 'Main Hall', date: '2024-10-26', start_time: '09:00', end_time: '10:00' },
])

export const useEventDetailsApi = () => {

  // --- Expenses ---
  const getExpensesByEvent = (eventId) => computed(() => expenses.value.filter(e => e.event_id == eventId))
  
  const createExpense = (data) => {
    expenses.value.push({ ...data, id: Date.now() })
    alert('บันทึกค่าใช้จ่ายแล้ว!')
  }
  const deleteExpense = (id) => {
    expenses.value = expenses.value.filter(e => e.id !== id)
  }

  // --- Tasks ---
  const getTasksByEvent = (eventId) => computed(() => tasks.value.filter(t => t.event_id == eventId))
  
  const createTask = (data) => {
    tasks.value.push({ ...data, id: Date.now(), is_completed: false })
    alert('เพิ่มงานแล้ว!')
  }
  const toggleTask = (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.is_completed = !task.is_completed
  }
  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  // --- Timeline ---
  const getTimelineByEvent = (eventId) => computed(() => {
    // Group by Date
    const items = timelineItems.value.filter(t => t.event_id == eventId)
    const groups = {}
    items.forEach(item => {
      if (!groups[item.date]) groups[item.date] = []
      groups[item.date].push(item)
    })
    // Sort by time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => a.start_time.localeCompare(b.start_time))
    })
    return groups
  })

  const createTimelineItem = (data) => {
    timelineItems.value.push({ ...data, id: Date.now() })
    alert('เพิ่มกำหนดการแล้ว!')
  }
  const deleteTimelineItem = (id) => {
    timelineItems.value = timelineItems.value.filter(t => t.id !== id)
  }

  return {
    getExpensesByEvent, createExpense, deleteExpense,
    getTasksByEvent, createTask, toggleTask, deleteTask,
    getTimelineByEvent, createTimelineItem, deleteTimelineItem
  }
}