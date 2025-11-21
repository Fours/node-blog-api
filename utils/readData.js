import fs from 'node:fs/promises'
import path from 'node:path'

export default async function readData() {

  try { 
    const dataPath = path.join('data', 'data.json')
    const data = await fs.readFile(dataPath, 'utf8')
    return JSON.parse(data)
  } catch(err) {
    console.log(err)
    return []
  }
}