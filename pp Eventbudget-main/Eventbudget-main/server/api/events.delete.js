// server/api/events.delete.js
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // ตรวจสอบว่ามี ID ส่งมาใน Query หรือไม่ (เช่น ?id=1)
  if (!query.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  try {
    // สั่งลบข้อมูลออกจาก Database
    const deletedEvent = await prisma.event.delete({
      where: { id: Number(query.id) }
    })
    return deletedEvent
  } catch (error) {
    console.error('Delete Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete event' })
  }
})