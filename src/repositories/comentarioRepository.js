const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.criar = async (mensagem, postId, usuarioId) => {
    return await prisma.comentario.create({
        data: {
            mensagem,

            post: {
                connect: {
                    id: postId
                }
            },

            usuario: {
                connect: {
                    id: usuarioId
                }
            }
        }
    })
}

exports.buscarPorPost = async(postId) => {
    return await prisma.comentario.findMany({
        where: {
            postId
        },

        orderBy: {
            criadoEm: "asc"
        },

        include: {
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    username: true,
                    fotoPerfil: true
                }
            }
        }
    })
}