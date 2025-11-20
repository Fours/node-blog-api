import http from 'node:http'

const PORT = 3000

const server = http.createServer(async (req, res) => {

    res.statusCode = 200
    res.end("server is running")
    
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))