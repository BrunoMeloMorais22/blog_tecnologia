const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.criarPost = async(data) => {
    return await prisma.publicacao.create({
        data
    })
}

exports.getPosts = async() => {
    return await prisma.publicacao.findMany()
}

exports.buscarPorId = async (publicacaoId) => {
    return await prisma.publicacao.findUnique({
        where: {
            id: publicacaoId
        }
    })
}

exports.editarPost = async (publicacaoId, descricao) => {
    return await prisma.publicacao.update({
        where: {
            id: publicacaoId
        },

        data: {
            descricao: descricao
        }
    })
}

exports.deletarPost = async(publicacaoId) => {
    return await prisma.publicacao.delete({
        where: {
            id: publicacaoId
        }
    })
}