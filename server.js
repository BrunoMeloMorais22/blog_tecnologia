require('dotenv').config()
const newrelic = require('newrelic')
const http = require('http')

const app = require('./app')
const { inicializarSocket } = require('./src/config/socket')

newrelic.recordLogEvent({
    message: 'Teste de log do Blog API',
    level: 'info'
})

const server = http.createServer(app)

inicializarSocket(server)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
