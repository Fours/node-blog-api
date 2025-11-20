import readPostsData from '../utils/readPostsData.js'
import sendResponse from '../utils/sendResponse.js'

export async function handleGetAllPosts(res) {
    const data = await readPostsData()
    sendResponse(res, 200, 'application/json', JSON.stringify(data))
}

export function handleNotFound(res) {
    const data = {
        message: "Not Found"
    }
    sendResponse(res, 404, 'application/json', JSON.stringify(data))
}