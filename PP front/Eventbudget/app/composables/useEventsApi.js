import { ref } from 'vue'

const events = ref([])
const pending = ref(false)
let initialized = false

// ⭐️ Default object ที่ตรงกับตาราง events ใน DB 100%
const defaultEvent = {
  id: 0,
  name: 'No Name',
  description: '',
  start_date: '',
  end_date: '',
  client_name: '',
  location: '',
  total_budget: null,
  venue_name: '',
  venue_url: '',
  accommodation_name: '',
  accommodation_url: '',
  drive_link: '',
}

export const useEventsApi = () => {
  
  const fetchEvents = async () => {
    if (initialized) return 
    pending.value = true
    try {
      const data = await $fetch('/api/events') 
      events.value = data.map(e => ({
        ...defaultEvent, // Merge กับ default เพื่อกัน Field หาย
        ...e 
      })) 
      initialized = true
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      pending.value = false
    }
  }

  const createEvent = async (eventData) => {
    const newEvent = { 
      ...defaultEvent, // ใช้ default เป็นฐาน
      ...eventData, 
      id: Math.max(0, ...events.value.map(e => e.id)) + 1 
    }
    events.value.push(newEvent)
    // ในสถานการณ์จริง ตรงนี้จะยิง API POST
    alert('เพิ่มอีเว้นต์สำเร็จ! (Mock)')
    return newEvent
  }
  
  const updateEvent = async (id, eventData) => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...eventData }
      // ในสถานการณ์จริง ตรงนี้จะยิง API PUT/PATCH
      alert('อัปเดตข้อมูลสำเร็จ! (Mock)')
    }
  }

  const deleteEvent = async (id) => {
    events.value = events.value.filter(e => e.id !== id)
    // ในสถานการณ์จริง ตรงนี้จะยิง API DELETE
    alert('ลบข้อมูลสำเร็จ! (Mock)')
  }

  const getEventById = (id) => {
    // คืนค่าเป็น ref เพื่อให้ reactive
    const event = events.value.find(e => e.id === Number(id))
    return ref(event ? { ...defaultEvent, ...event } : null)
  }

  return {
    events, pending, fetchEvents, createEvent,
    updateEvent, deleteEvent, getEventById,
  }
}