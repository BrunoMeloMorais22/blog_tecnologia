const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const AppError = require('../utils/AppError')

exports.criarPost = async (data) => {
    return await prisma.$transaction(async (tx) => {

        const categoria = await tx.categoria.findUnique({
            where: {
                id: data.categoriaId
            }
        })

        if (!categoria) {
            throw new AppError("Categoria não encontrada", 404)
        }

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

exports.getPosts = async (usuarioId) => {
    return await prisma.publicacao.findMany({
        include: {
            _count: {
                select: {
                    curtidas: true
                }
            },

            usuario: {
                select: {
                    nome: true,
                    username: true,
                    fotoPerfil: true
                }
            },

            categoria: {
                select: {
                    nome: true
                }
            },

            ...(usuarioId && {
                curtidas: {
                    where: {
                        usuarioId: usuarioId
                    }
                }
            })
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

exports.buscarPorId = async(postId) => {
    return await prisma.publicacao.findUnique({
        where: {
            id: postId
        }
    })
}