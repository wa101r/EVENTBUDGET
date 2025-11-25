// server/api/settings/restore.post.js
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const events = body.data || []

  if (!Array.isArray(events)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Backup File' })
  }

  try {
    // ใช้ Transaction เพื่อความปลอดภัย (ถ้าพังให้ Rollback หมด)
    await prisma.$transaction(async (tx) => {
      // 1. ลบข้อมูลเก่าทั้งหมด (เรียงลำดับจากลูกไปหาแม่ เพื่อเลี่ยง Foreign Key Error)
      await tx.scheduleItem.deleteMany()
      await tx.eventDay.deleteMany()
      await tx.expense.deleteMany()
      await tx.task.deleteMany()
      await tx.event.deleteMany()

      // 2. ลงข้อมูลใหม่
      for (const evt of events) {
        // แยก ID ออกเพื่อให้ Auto Increment ทำงานต่อได้ หรือจะใส่ ID เดิมก็ได้
        const { id, expenses, tasks, days, ...eventData } = evt
        
        await tx.event.create({
          data: {
            ...eventData,
            // ใส่ข้อมูลลูกๆ (Expenses, Tasks, Days -> Items)
            expenses: {
              create: expenses.map(({ id, eventId, ...e }) => e)
            },
            tasks: {
              create: tasks.map(({ id, eventId, ...t }) => t)
            },
            days: {
              create: days.map(({ id, eventId, items, ...d }) => ({
                ...d,
                items: {
                  create: items.map(({ id, dayId, ...i }) => i)
                }
              }))
            }
          }
        })
      }
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Restore Failed' })
  }
})