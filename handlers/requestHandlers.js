import readPostsData from '../utils/readPostsData.js'
import sendResponse from '../utils/sendResponse.js'

export async function handleGetAllPosts(res) {    
    const data = await readPostsData()
    sendResponse(res, 200, 'application/json', JSON.stringify(data))
}

export async function handleGetOnePost(res, postId) {
    const data = await readPostsData()
    const post = data.find(p => p.id === postId)
    if (post) {
        sendResponse(res, 200, 'application/json', JSON.stringify(post))    
    } else {
        handleNotFound(res)
    }
}

export function handleNotFound(res) {
    const data = {
        message: "Not Found"
    }
    sendResponse(res, 404, 'application/json', JSON.stringify(data))
}

export function handleError(res, msg) {
    const data = {
        error: `Internal Error: ${msg}`
    }
    sendResponse(res, 500, 'application/json', JSON.stringify(data))
}

