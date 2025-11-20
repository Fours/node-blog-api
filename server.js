import http from 'node:http'
import { handleGetAllPosts, handleNotFound } from './handlers/requestHandlers.js'

const PORT = 3000

const server = http.createServer(async (req, res) => {

    if (req.url.startsWith('/api')) {

        if(req.url === '/api/posts') {
            handleGetAllPosts(res)
        } else {
            handleNotFound(res)
        }

    } else {
        handleNotFound(res)
    }
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))