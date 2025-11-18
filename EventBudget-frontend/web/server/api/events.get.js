import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'server/data/events.json')
  const json = await readFile(filePath, 'utf8')

  return JSON.parse(json)
})
