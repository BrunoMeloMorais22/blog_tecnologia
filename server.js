require('dotenv').config()
const newrelic = require('newrelic')


newrelic.recordLogEvent({
    message: 'Teste de log do Blog API',
    level: 'info'
})

const app = require('./app')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})