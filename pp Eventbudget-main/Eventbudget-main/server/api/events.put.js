// server/api/events.put.js
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // ตรวจสอบว่ามี ID ส่งมาหรือไม่
  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  try {
    // สั่งอัปเดตข้อมูลลง Database
    const updatedEvent = await prisma.event.update({
      where: { id: Number(body.id) },
      data: {
        name: body.name,
        description: body.description,
        start_date: body.start_date,
        end_date: body.end_date,
        client_name: body.client_name,
        location: body.location,
        total_budget: body.total_budget ? Number(body.total_budget) : 0,
        venue_name: body.venue_name,
        venue_url: body.venue_url,
        accommodation_name: body.accommodation_name,
        accommodation_url: body.accommodation_url,
        drive_link: body.drive_link
      }
    })
    return updatedEvent
  } catch (error) {
    console.error('Update Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update event' })
  }
})