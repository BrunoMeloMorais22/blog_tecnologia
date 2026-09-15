require('dotenv').config()
const newrelic = require('newrelic')
const http = require('http')
const { Server } = require('socket.io')

const app = require('./app')

newrelic.recordLogEvent({
    message: 'Teste de log do Blog API',
    level: 'info'
})

const server = http.createServer(app)

const io = new Server(server)

io.on("connection", (socket) => {
    socket.on("novo_comentario", (comentario) => {
        io.emit("comentario_recebido", comentario)
    })

    socket.on("disconnect", () => {
        console.log("Usuário desconectado")
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})