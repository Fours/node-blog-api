import path from 'node:path'
import fs from 'node:fs/promises'
import readData from './readData.js'

export default async function writeNewPost(post) {
    const posts = await readData()
    posts.push(post)
    
    const dataPath = path.join('data', 'data.json')
    
    await fs.writeFile(
        dataPath,
        JSON.stringify(posts, null, 2),
        'utf8'
    )
}