// server/api/settings/backup.get.js
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // ดึงข้อมูล Events พร้อมข้อมูลที่เกี่ยวข้องทั้งหมด (Nested)
    const events = await prisma.event.findMany({
      include: {
        expenses: true,
        tasks: true,
        days: {
          include: {
            items: true
          }
        }
      }
    })

    // ส่งกลับเป็น JSON
    return {
      timestamp: new Date().toISOString(),
      data: events
    }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Backup Failed' })
  }
})