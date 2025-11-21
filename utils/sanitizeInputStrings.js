import sanitizeHtml from 'sanitize-html'

export default function sanitizeInputStrings(data) {

    const sanitizedData = {}

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitizedData[key] = 
                sanitizeHtml(value, { allowedTags: ['p','b'], allowedAttributes: {}}).trim()
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