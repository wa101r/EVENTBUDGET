export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.expense.create({
    data: {
      name: body.name,
      amount: Number(body.amount),
      date: body.date,
      time: body.time,
      category: body.category,
      icon: body.icon,
      eventId: Number(body.event_id) // ระวังชื่อ field ตรงนี้ให้ตรงกับ frontend
    }
  })
})