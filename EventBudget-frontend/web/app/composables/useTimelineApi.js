import { ref } from 'vue'

export const useTimelineApi = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiBase || 'http://localhost:8000/api'

  // 1. ดึงข้อมูล Timeline (แก้ตรงนี้ให้ส่งค่า refresh กลับไป)
  const getTimelineByEventId = async (eventId) => {
    const { data, refresh, pending, error } = await useFetch(`${API_URL}/timeline`, {
      query: { eventId },
      key: `timeline-${eventId}`,
      watch: [ref(eventId)]
    })
    
    // ✅ ส่งกลับไปทั้งก้อนเลย (จะได้ใช้ refresh ได้)
    return { data, refresh, pending, error }
  }

  // 2. เพิ่มวันใหม่
  const addDay = async (data) => {
    return await $fetch(`${API_URL}/days`, {
      method: 'POST',
      body: data
    })
  }

  // 3. ลบวัน
  const deleteDay = async (id) => {
    return await $fetch(`${API_URL}/days/${id}`, {
      method: 'DELETE'
    })
  }

  // 4. เพิ่มกิจกรรม (Item)
  const addItem = async (dayId, data) => {
    return await $fetch(`${API_URL}/items`, {
      method: 'POST',
      body: { ...data, event_day_id: dayId }
    })
  }

  // 5. แก้ไขกิจกรรม
  const updateItem = async (dayId, data) => {
    return await $fetch(`${API_URL}/items/${data.id}`, {
      method: 'PUT',
      body: data
    })
  }

  // 6. ลบกิจกรรม
  const deleteItem = async (dayId, itemId) => {
    return await $fetch(`${API_URL}/items/${itemId}`, {
      method: 'DELETE'
    })
  }

  return {
    getTimelineByEventId,
    addDay,
    deleteDay,
    addItem,
    updateItem,
    deleteItem
  }
}