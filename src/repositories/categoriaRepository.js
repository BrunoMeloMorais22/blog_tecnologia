const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.pegarCategoria = async(slug) => {
    return await prisma.categoria.findUnique({
        where: {
            slug
        },

        include: {
            publicacoes: true
        }
    })
}

exports.listarCategorias = async() => {
    return await prisma.categoria.findMany({
        select:{
            id: true,
            nome: true,
            slug: true
        },

        orderBy: {
            nome: 'asc'
        }
    })
}