
const amqp = require('amqplib')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost'

const FILA = 'notificacoes-blog'
const FILA_RETRY = 'notificacoes-blog.retry'
const FILA_DLQ = 'notificacoes-blog.dlq'

let conexao
let canal
let canalRetry
let encerrando = false

function obterTentativas(mensagem) {
    return mensagem.properties.headers?.['x-retry-count'] ?? 0
}

async function eventoJaProcessado(eventId) {
    const evento = await prisma.eventoProcessado.findUnique({
        where: { eventId }
    })

    return evento !== null
}

async function processarEvento(evento) {
    if (evento.tipo !== 'PublicacaoCriada') {
        throw new Error(`Tipo de evento não suportado: ${evento.tipo}`)
    }

    console.log('Publicação criada!')
    console.log('ID da publicação:', evento.dados.publicacaoId)
    console.log('Título:', evento.dados.titulo)
    console.log('Usuário:', evento.dados.usuarioId)

    
}

async function registrarFalha(evento, erro, tentativas) {
    await prisma.falhaMensageria.create({
        data: {
            eventId: evento.eventId,
            tipoEvento: evento.tipo,
            mensagemErro: erro.message,
            tentativas: tentativas + 1,
            payload: evento
        }
    })

    console.log('Falha registrada no PostgreSQL:', evento.eventId)
}

async function enviarParaRetry(mensagem, tentativas) {
    await new Promise((resolve, reject) => {
        canalRetry.sendToQueue(
            FILA_RETRY,
            mensagem.content,
            {
                persistent: true,
                contentType: mensagem.properties.contentType,
                headers: {
                    ...mensagem.properties.headers,
                    'x-retry-count': tentativas + 1
                }
            },
            (erro) => {
                if (erro) return reject(erro)
                resolve()
            }
        )
    })

    await canalRetry.waitForConfirms()
}

async function consumirMensagem(mensagem) {
    if (!mensagem) return

    let evento

    try {
        evento = JSON.parse(mensagem.content.toString())

        if (!evento.eventId || !evento.tipo || !evento.dados) {
            throw new Error('Payload do evento inválido')
        }

        console.log('Mensagem recebida:', evento.eventId)

        if (await eventoJaProcessado(evento.eventId)) {
            console.log('Evento já processado. Ignorando duplicação.')
            canal.ack(mensagem)
            return
        }

        await processarEvento(evento)

        await prisma.eventoProcessado.create({
            data: {
                eventId: evento.eventId,
                tipoEvento: evento.tipo
            }
        })

        canal.ack(mensagem)
        console.log('Evento processado e confirmado com ACK!')
    } catch (erro) {
        console.error('Falha no processamento:', erro.message)

        const tentativas = obterTentativas(mensagem)

        if (tentativas < 1) {
            try {
                await enviarParaRetry(mensagem, tentativas)

                canal.ack(mensagem)
                console.log('Mensagem enviada para retry.')
            } catch (erroRetry) {
                console.error(
                    'Falha ao publicar retry:',
                    erroRetry.message
                )

                canal.nack(mensagem, false, true)
            }

            return
        }

        try {
            if (evento?.eventId && evento?.tipo && evento?.dados) {
                await registrarFalha(evento, erro, tentativas)
            } else {
                console.error(
                    'Não foi possível registrar a falha: evento inválido.'
                )
            }

            canal.nack(mensagem, false, false)
            console.log('Mensagem rejeitada. RabbitMQ encaminhará para a DLQ.')
        } catch (erroRegistro) {
            console.error(
                'Falha ao registrar no PostgreSQL:',
                erroRegistro.message
            )

            canal.nack(mensagem, false, true)
        }
    }
}

async function iniciarConsumer() {
    conexao = await amqp.connect(RABBITMQ_URL)

    canal = await conexao.createChannel()
    canalRetry = await conexao.createConfirmChannel()

    await canal.assertQueue(FILA_DLQ, { durable: true })

    await canal.assertQueue(FILA, {
        durable: true,
        arguments: {
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': FILA_DLQ
        }
    })

    await canal.assertQueue(FILA_RETRY, {
        durable: true,
        arguments: {
            'x-message-ttl': 5000,
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': FILA
        }
    })

    await canal.prefetch(1)

    console.log('Consumer aguardando mensagens...')

    await canal.consume(FILA, (mensagem) => {
        consumirMensagem(mensagem).catch((erro) => {
            console.error('Erro inesperado no consumer:', erro)

            if (mensagem && canal) {
                canal.nack(mensagem, false, true)
            }
        })
    })
}

async function encerrar() {
    if (encerrando) return
    encerrando = true

    console.log('\nEncerrando consumer...')

    try {
        if (canal) await canal.close()
        if (canalRetry) await canalRetry.close()
        if (conexao) await conexao.close()
    } catch (erro) {
        console.error('Erro ao fechar conexão:', erro.message)
    } finally {
        await prisma.$disconnect()
        process.exit(0)
    }
}

process.once('SIGINT', encerrar)
process.once('SIGTERM', encerrar)

iniciarConsumer().catch(async (erro) => {
    console.error('Não foi possível iniciar o consumer:', erro.message)
    await prisma.$disconnect()
    process.exitCode = 1
})
