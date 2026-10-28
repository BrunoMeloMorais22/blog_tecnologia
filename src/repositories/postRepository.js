const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.criarPost = async (data) => {
    return await prisma.$transaction(async (tx) => {
        const post = await tx.publicacao.create({
            data
        })

        await tx.outbox.create({
            data: {
                tipoEvento: "PublicacaoCriada",
                dados: {
                    publicacaoId: post.id,
                    titulo: post.titulo,
                    usuarioId: post.usuarioId
                }
            }
        })

        return post
    })
} 

exports.getPosts = async() => {
    return await prisma.publicacao.findMany({
        include: {
            _count: {
                select: {
                    curtidas: true   
                }
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