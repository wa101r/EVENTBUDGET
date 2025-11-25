export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.eventDay.create({
    data: {
      date: body.date,
      title: body.title,
      eventId: Number(body.event_id)
    }
  })
})