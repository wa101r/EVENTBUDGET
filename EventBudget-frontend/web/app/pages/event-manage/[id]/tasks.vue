<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksApi } from '~/composables/useTasksApi' // ✅ เรียกใช้ API

import TaskItem from '~/components/tasks/TaskItem.vue' 
import TaskFormModal from '~/components/tasks/TaskFormModal.vue'
import EventFabButton from '~/components/event/EventFabButton.vue'

definePageMeta({ layout: 'detail', title: 'Tasks' })

const route = useRoute()
const eventId = route.params.id
const { getTasks, createTask, updateTask, deleteTask } = useTasksApi()

// ✅ 1. ดึงข้อมูลจริงจาก DB
const { data: tasks, refresh } = await getTasks(eventId)

const isModalOpen = ref(false)

// Logic แยกงานที่เสร็จ/ไม่เสร็จ
const pendingTasks = computed(() => (tasks.value || []).filter(t => !t.is_completed)) // เช็คชื่อ column ใน DB ดีๆ นะครับ (is_completed หรือ completed)
const completedTasks = computed(() => (tasks.value || []).filter(t => t.is_completed))

const openAddModal = () => { isModalOpen.value = true }

// ✅ 2. บันทึกลง DB จริง
const handleSaveTask = async (formData) => {
  try {
    await createTask({
      event_id: eventId,
      title: formData.title,
      due_date: formData.due_date,
      due_time: formData.due_time, // ส่งเวลาไปด้วย
      is_completed: false
    })
    refresh() // โหลดข้อมูลใหม่
    isModalOpen.value = false
  } catch (err) {
    alert('บันทึกไม่สำเร็จ: ' + err)
  }
}

// ✅ 3. อัปเดตสถานะลง DB
const toggleTask = async (task) => {
  try {
    // สลับค่า true/false
    const newStatus = !task.is_completed
    // อัปเดต UI ทันที (Optimistic UI)
    task.is_completed = newStatus 
    
    // ยิง API อัปเดต
    await updateTask(task.id, { is_completed: newStatus })
    refresh()
  } catch (err) {
    alert('อัปเดตไม่สำเร็จ')
  }
}

// ✅ 4. ลบงานจาก DB
const handleDeleteTask = async (id) => {
  if(!confirm('ลบงานนี้?')) return
  try {
    await deleteTask(id)
    refresh()
  } catch (err) {
    alert('ลบไม่สำเร็จ')
  }
}
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto space-y-6 pb-24">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Tasks</h1>
      <p class="text-slate-500 text-sm">รายการสิ่งที่ต้องทำ</p>
    </div>

    <div 
      v-if="!tasks || tasks.length === 0" 
      class="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200 text-center"
    >
      <div class="text-4xl mb-3">📝</div>
      <p class="text-slate-500 font-medium">ไม่มีงานค้าง สบายจัง!</p>
      <p class="text-xs text-slate-400 mt-1">กดปุ่ม + ด้านล่างเพื่อเพิ่มงาน</p>
    </div>

    <div v-else class="space-y-6">
      <div v-if="pendingTasks.length > 0" class="space-y-3">
        <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">To Do ({{ pendingTasks.length }})</h2>
        <TaskItem 
          v-for="task in pendingTasks" 
          :key="task.id" 
          :task="task" 
          @toggle="toggleTask"
          @delete="handleDeleteTask"
        />
      </div>

      <div v-if="completedTasks.length > 0" class="space-y-3 opacity-75">
        <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">Completed ({{ completedTasks.length }})</h2>
        <TaskItem 
          v-for="task in completedTasks" 
          :key="task.id" 
          :task="task" 
          @toggle="toggleTask"
          @delete="handleDeleteTask"
        />
      </div>
    </div>

    <EventFabButton @click="openAddModal" />

    <TaskFormModal 
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @save="handleSaveTask"
    />
  </div>
</template>