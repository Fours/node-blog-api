import http from 'node:http'
import { 
    handleGetAll, 
    handleGetOne,
    handlePost, 
    handleNotFound,
    handleError 
} from './handlers/requestHandlers.js'

const PORT = 3000
const PROTOCOL = 'http'

const server = http.createServer(async (req, res) => {

    const host = req.headers.host.split(`:${PORT}`)[0]        
    const url = new URL(`${PROTOCOL}://${host}${req.url}`)
    
    try {
        
        if (url.pathname.startsWith('/api')) {

            if(url.pathname === '/api/posts') {
                switch(req.method) {
                    case 'GET':
                        handleGetAll(res, Object.fromEntries(url.searchParams))
                        break;
                    case 'POST':
                        handlePost(req, res)
                        break;
                    case 'PUT':
                        handleNotFound(res)
                        break;
                    case 'PATCH':
                        handleNotFound(res)
                        break;
                    default:
                        handleNotFound(res)
                }
            } else if (url.pathname.startsWith('/api/posts/')) {
                const segments = url.pathname.split('/')
                if (segments.length === 4) {
                    handleGetOne(res, segments[3])
                } else {
                    handleNotFound(res)
                }
            } else {
                handleNotFound(res)
            }

        } else {
            handleNotFound(res)
        }

    } catch(err) {
        console.log(err)
        handleError(res, err)
    }
    
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))