export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.task.create({
    data: {
      title: body.title,
      due_date: body.due_date,
      eventId: Number(body.event_id)
    }
  })
})