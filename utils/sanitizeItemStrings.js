import sanitizeHtml from 'sanitize-html'

export default function sanitizeItemStrings(data) {

    const sanitizedData = {}

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitizedData[key] = key === 'body' ?
                sanitizeHtml(value, { allowedTags: ['p','b'], allowedAttributes: {}}).trim() :
                sanitizeHtml(value, { allowedTags: [], allowedAttributes: {}}).trim()
        } else if (Array.isArray(value)) {
            sanitizedData[key] = value.map(item => {
                if (typeof item === 'string') {
                    return sanitizeHtml(item, { allowedTags: [], allowedAttributes: {}}).trim()
                } else {
                    return item
                }
            })            
        } else {
            sanitizedData[key] = value
        }
    }

  return sanitizedData
}