

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // บันทึกลง DB จริง
  const newEvent = await prisma.event.create({
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
  
  return newEvent
})