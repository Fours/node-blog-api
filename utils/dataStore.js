import fs from 'node:fs/promises'
import path from 'node:path'

export async function readData() {
  try { 
    const dataPath = path.join('data', 'data.json')
    const data = await fs.readFile(dataPath, 'utf8')
    return JSON.parse(data)
  } catch(err) {
    console.log(err)
    return []
  }
}

export async function writeData(data) {    
    const dataPath = path.join('data', 'data.json')    
    await fs.writeFile(
        dataPath,
        JSON.stringify(data, null, 2),
        'utf8'
    )
}