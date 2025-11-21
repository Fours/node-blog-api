import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/dataStore.js'
import sendResponse from '../utils/sendResponse.js'
import getRequestData from '../utils/getRequestData.js'
import validateItem from '../utils/validateItem.js'
import sanitizeItemStrings from '../utils/sanitizeItemStrings.js'

export async function handleGetAll(res, queryParams) {

    const data = await readData()
    const filteredItems = Object.keys(queryParams).length > 0 ? filterItems(data, queryParams) : data
    sendResponse(res, 200, 'application/json', JSON.stringify(filteredItems))
}

function filterItems(items, queryParams) {
    
    let filteredItems = items
    if (queryParams.author) {
        filteredItems = filteredItems.filter(post => {
            return queryParams.author.toLowerCase() === post.author.toLowerCase()
        })
    }
    if (queryParams.tags) {
        const tags = queryParams.tags.split(',')
        filteredItems = filteredItems.filter(post => {
            return tags.every(tag => {
                return post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
            })
        })
    }
    return filteredItems
}

export async function handleGetOne(res, id) {
    const data = await readData()
    const item = data.find(p => p.id === id)
    if (item) {
        sendResponse(res, 200, 'application/json', JSON.stringify(item))
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

export async function handleDelete(res, id) {
    const data = await readData()
    const existingItem = data.find(item => item.id === id)
    if(existingItem) {
        const updatedData = data.filter(item => item.id !== id)
        await writeData(updatedData)
        sendResponse(res, 204, 'application/json', '')
    } else {
        handleNotFound(res)
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

