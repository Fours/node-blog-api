import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/dataStore.js'
import sendResponse from '../utils/sendResponse.js'
import getRequestData from '../utils/getRequestData.js'
import validateItem from '../utils/validateItem.js'
import sanitizeItemStrings from '../utils/sanitizeItemStrings.js'

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
    const sanitizedItem = sanitizeItemStrings(payload)
    const validatedItem = validateItem(sanitizedItem)
    if (validatedItem) {
        const newItem = { id: uuidv4(), ...validatedItem}
        const data = await readData()
        data.push(newItem)
        await writeData(data)
        sendResponse(res, 201, 'application/json', JSON.stringify(newItem))
    } else {
        handleBadRequest(res)
    }
}

export async function handlePut(req, res) {
    
    const payload = await getRequestData(req)
    const sanitizedItem = sanitizeItemStrings(payload)
    const data = await readData()
    const existingItem = data.find(item => item.id === payload.id)

    if (existingItem) {
        const mergedItem = {...existingItem, ...sanitizedItem}
        const validatedItem = validateItem(mergedItem)
        if (validatedItem) {
            const updatedItem = { id: payload.id, ...validatedItem}
            const mergedData = data.map(item => item.id === updatedItem.id ? updatedItem : item)
            await writeData(mergedData)
            sendResponse(res, 200, 'application/json', JSON.stringify(updatedItem))
        } else {
            handleBadRequest(res)
        }
    } else {
        const validatedItem = validateItem(sanitizedItem)
        if (validatedItem) {
            const newItem = { id: uuidv4(), ...validatedItem}
            data.push(newItem)
            await writeData(data)
            sendResponse(res, 201, 'application/json', JSON.stringify(newItem))
        } else {
            handleBadRequest(res)
        }
    }
}

function handleBadRequest(res) {
    sendResponse(res, 400, 'application/json', JSON.stringify({
        message: 'Invalid request data'
    }))
}

export function handleNotFound(res) {
    sendResponse(res, 404, 'application/json', JSON.stringify({
        message: "Not Found"
    }))
}

export function handleError(res, msg) {
    sendResponse(res, 500, 'application/json', JSON.stringify({
        error: `Internal Error: ${msg}`
    }))
}

