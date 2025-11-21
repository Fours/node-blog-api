import { v4 as uuidv4 } from 'uuid';
import readData from '../utils/readData.js'
import sendResponse from '../utils/sendResponse.js'
import getRequestData from '../utils/getRequestData.js'
import validateRequestData from '../utils/validateRequestData.js'
import sanitizeInputStrings from '../utils/sanitizeInputStrings.js'
import writeNewPost from '../utils/writeNewPost.js'

export async function handleGetAll(res, queryParams) {

    const data = await readData()
    const filteredPosts = Object.keys(queryParams).length > 0 ? filterPosts(data, queryParams) : data
    sendResponse(res, 200, 'application/json', JSON.stringify(filteredPosts))
}

function filterPosts(posts, queryParams) {
    
    let filteredPosts = posts
    if (queryParams.author) {
        filteredPosts = filteredPosts.filter(post => {
            return queryParams.author.toLowerCase() === post.author.toLowerCase()
        })
    }
    if (queryParams.tags) {
        const tags = queryParams.tags.split(',')
        filteredPosts = filteredPosts.filter(post => {
            return tags.every(tag => {
                return post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
            })
        })
    }
    return filteredPosts
}

export async function handleGetOne(res, postId) {
    const data = await readData()
    const post = data.find(p => p.id === postId)
    if (post) {
        sendResponse(res, 200, 'application/json', JSON.stringify(post))    
    } else {
        handleNotFound(res)
    }
}

export async function handlePost(req, res) {

    const payload = await getRequestData(req)
    const sanitizedPayload = sanitizeInputStrings(payload)
    const validatedData = validateRequestData(sanitizedPayload)
    if (validatedData) {
        validatedData.id = uuidv4()
        await writeNewPost(validatedData)
        sendResponse(res, 201, 'application/json', JSON.stringify(validatedData))
    } else {
        sendResponse(res, 400, 'application/json', JSON.stringify({
            message: 'Invalid request data'
       })) 
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

