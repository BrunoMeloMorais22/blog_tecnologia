const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.criarCurtida = async(usuarioId, publicacaoId) => {
    return await prisma.curtida.create({
        data: {
            usuarioId, 
            publicacaoId
        }
    })
}

exports.removerCurtida = async (usuarioId, publicacaoId) => {
    return await prisma.curtida.delete({
        where: {
            usuarioId_publicacaoId: {
                usuarioId,
                publicacaoId
            }
        }
    });
};

exports.buscarCurtida = async(usuarioId, publicacaoId) => {
    return await prisma.curtida.findUnique({
        where: {
            usuarioId_publicacaoId: {
                usuarioId: usuarioId,
                publicacaoId: publicacaoId
            }
        }
    })
}

exports.buscarPorId = async (publicacaoId) => {
    return await prisma.publicacao.findUnique({
        where: {
            id: publicacaoId
        }
    })
}