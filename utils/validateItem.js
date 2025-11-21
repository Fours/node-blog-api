export default function validateItem(data) {

    if(
        typeof data.timestamp !== 'number' || 
        typeof data.author !== 'string' ||
        !isStringArray(data.tags) ||
        typeof data.blurb !== 'string' ||
        typeof data.body !== 'string') {
        
        return false
    }

    return {
        timestamp: data.timestamp,
        author: data.author,
        tags: data.tags,
        blurb: data.blurb,
        body: data.body
    }
}

function isStringArray(data) {
    return Array.isArray(data) && data.every(item => {
        return typeof item === 'string'
    })
}