
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

exports.findById = async(usuarioId) => {
    return await prisma.usuario.findUnique({
        where: {
            id: usuarioId
        }
    })
}

exports.findByUserId = async (usuarioId) => {
    return await prisma.usuario.findUnique({
        where:{
            id: usuarioId
        },

        select:{
            nome: true,
            email: true,
            descricao: true,
            website: true,
            criadoEm: true,
            _count: {
                select: {
                    publicacao: true
                }
            }
        }
    })
}

exports.update = async(usuarioId, nome, email, descricao, website) => {
    return await prisma.usuario.update({
        where:{
            id: usuarioId
        },

        data:{
            ...(nome !== undefined && { nome }),
            ...(email !== undefined && { email }),
            ...(descricao !== undefined && { descricao }),
            ...(website !== undefined && { website })
        }
    })
}

exports.countUsuario = () => {
    return prisma.usuario.count()  
}

exports.countPost = () => {
    return prisma.publicacao.count()
}