
require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const amqp = require('amqplib')

const prisma = new PrismaClient()

const FILA = 'notificacoes-blog'
const INTERVALO = 5000

let encerrando = false

function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function publicarEventos() {
    let conexaoRabbit
    let canal

    try {
        conexaoRabbit = await amqp.connect(
            process.env.RABBITMQ_URL || 'amqp://localhost'
        )

        canal = await conexaoRabbit.createConfirmChannel()

        await canal.assertQueue('notificacoes-blog.dlq', {
            durable: true
        })

        await canal.assertQueue(FILA, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': '',
                'x-dead-letter-routing-key': 'notificacoes-blog.dlq'
            }
        })

        const eventos = await prisma.outbox.findMany({
            where: { status: 'PENDENTE' },
            orderBy: { criadoEm: 'asc' }
        })

        if (eventos.length > 0) {
            console.log(`Eventos pendentes encontrados: ${eventos.length}`)
        }

        for (const evento of eventos) {
            if (encerrando) break

            const mensagem = JSON.stringify({
                eventId: evento.id,
                tipo: evento.tipoEvento,
                dados: evento.dados
            })

            await new Promise((resolve, reject) => {
                canal.sendToQueue(
                    FILA,
                    Buffer.from(mensagem),
                    {
                        persistent: true,
                        contentType: 'application/json'
                    },
                    (erro) => {
                        if (erro) return reject(erro)
                        resolve()
                    }
                )
            })

            await canal.waitForConfirms()

            await prisma.outbox.update({
                where: { id: evento.id },
                data: {
                    status: 'PUBLICADO',
                    publicadoEm: new Date(),
                    erro: null
                }
            })

            console.log(`Evento publicado: ${evento.id}`)
        }
    } catch (erro) {
        console.error('Erro no ciclo de publicação:', erro.message)
    } finally {
        if (canal) await canal.close().catch(() => {})
        if (conexaoRabbit) await conexaoRabbit.close().catch(() => {})
    }
}

async function iniciarPublicador() {
    console.log('Publicador automático iniciado!')

    while (!encerrando) {
        await publicarEventos()

        if (!encerrando) {
            await esperar(INTERVALO)
        }
    }

    await prisma.$disconnect()
    console.log('Publicador encerrado.')
}

function encerrar() {
    encerrando = true
    console.log('Encerramento solicitado...')
}

process.once('SIGINT', encerrar)
process.once('SIGTERM', encerrar)

iniciarPublicador().catch(async (erro) => {
    console.error('Erro fatal no publicador:', erro)
    await prisma.$disconnect()
    process.exitCode = 1
})
