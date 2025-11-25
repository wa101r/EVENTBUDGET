import { ref, computed } from 'vue'

const days = ref([])

export const useTimelineApi = () => {
  
  const getTimelineByEventId = (eventId) => {
    // โหลดข้อมูลจาก Server
    $fetch(`/api/timeline?eventId=${eventId}`).then(data => {
      days.value = data
    })
    return computed(() => days.value)
  }

  const addDay = async (dayData) => {
    const newDay = await $fetch('/api/days', { method: 'POST', body: dayData })
    // ต้องเติม items array เปล่าๆ ให้ UI ไม่พัง
    days.value.push({ ...newDay, items: [] })
  }

  const deleteDay = async (dayId) => {
    await $fetch(`/api/days?id=${dayId}`, { method: 'DELETE' })
    days.value = days.value.filter(d => d.id !== dayId)
  }

  const addItem = async (dayId, itemData) => {
    const newItem = await $fetch('/api/items', { 
      method: 'POST', 
      body: { ...itemData, day_id: dayId } 
    })
    
    // อัปเดต UI ทันที
    const day = days.value.find(d => d.id === dayId)
    if (day) {
      if (!day.items) day.items = []
      day.items.push(newItem)
      // เรียงเวลา
      day.items.sort((a, b) => a.start_time.localeCompare(b.start_time))
    }
  }

  const deleteItem = async (dayId, itemId) => {
    await $fetch(`/api/items?id=${itemId}`, { method: 'DELETE' })
    const day = days.value.find(d => d.id === dayId)
    if (day) day.items = day.items.filter(i => i.id !== itemId)
  }

  // Update Item (Mock UI update only for now)
  const updateItem = (dayId, updatedItem) => {
    const day = days.value.find(d => d.id === dayId)
    if (day) {
      const idx = day.items.findIndex(i => i.id === updatedItem.id)
      if (idx !== -1) day.items[idx] = updatedItem
    }
  }

  return {
    getTimelineByEventId, addDay, deleteDay, addItem, deleteItem, updateItem
  }
}