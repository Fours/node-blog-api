import readPostsData from '../utils/readPostsData.js'
import sendResponse from '../utils/sendResponse.js'

export async function handleGetAllPosts(res, queryParams) {

    const data = await readPostsData()
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

