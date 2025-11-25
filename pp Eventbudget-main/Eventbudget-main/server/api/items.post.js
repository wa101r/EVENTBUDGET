export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.scheduleItem.create({
    data: {
      title: body.title,
      start_time: body.start_time,
      end_time: body.end_time,
      description: body.description,
      location: body.location,
      icon: body.icon,
      dayId: Number(body.day_id) // เชื่อมกับ ID ของวัน
    }
  })
})