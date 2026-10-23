
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.findByEmail = async (email) => {
    return await prisma.usuario.findUnique({
        where: { email }
    })
}

exports.create = async(data) => {
    return await prisma.usuario.create({
        data
    })
}

exports.findPostsByUserId = async(usuarioId) => {
    return await prisma.publicacao.findMany({
        where: {
            usuarioId: usuarioId
        }
    })
}