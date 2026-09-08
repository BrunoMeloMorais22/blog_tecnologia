const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.criarPost = async(data) => {
    return await prisma.publicacao.create({
        data
    })
}