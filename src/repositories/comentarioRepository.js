const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.criar = async(mensagem, postId, usuarioId) => {
    return await prisma.comentario.create({
        data:{
            mensagem, 
            postId, 
            usuarioId
        }
    })
}

exports.buscarPorId = async(postId) => {
    return await prisma.comentario.findMany({
        where: {
            postId: postId
        }
    })
}