import { ref, computed } from 'vue'

const tasks = ref([])

export const useEventDetailsApi = () => {
  
  const getTasksByEvent = (eventId) => {
    $fetch(`/api/tasks?eventId=${eventId}`).then(data => {
      tasks.value = data
    })
    return computed(() => tasks.value)
  }

  const createTask = async (taskData) => {
    const newTask = await $fetch('/api/tasks', { method: 'POST', body: taskData })
    tasks.value.unshift(newTask)
  }

  const toggleTask = async (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.is_completed = !task.is_completed
      // ส่งค่าไปอัปเดตที่ Server
      await $fetch('/api/tasks', { 
        method: 'PUT', 
        body: { id, is_completed: task.is_completed } 
      })
    }
  }

  const deleteTask = async (id) => {
    await $fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return {
    getTasksByEvent, createTask, toggleTask, deleteTask
  }
}