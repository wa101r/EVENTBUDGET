export const useTasksApi = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiBase || 'http://localhost:8000/api'

  // 1. ดึงงานทั้งหมดของ Event นี้
  const getTasks = async (eventId) => {
    return await useFetch(`${API_URL}/events/${eventId}/tasks`, {
      key: `tasks-${eventId}`,
      watch: [ref(eventId)]
    })
  }

  // 2. สร้างงานใหม่
  const createTask = async (data) => {
    return await $fetch(`${API_URL}/tasks`, {
      method: 'POST',
      body: data
    })
  }

  // 3. อัปเดตสถานะ (ติ๊กถูก/แก้ข้อมูล)
  const updateTask = async (id, data) => {
    return await $fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  // 4. ลบงาน
  const deleteTask = async (id) => {
    return await $fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    })
  }

  return { getTasks, createTask, updateTask, deleteTask }
}