
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

exports.findByUsername = async function (username) {
    return await prisma.usuario.findUnique({
        where: {
            username: username
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
        where: {
            id: usuarioId
        },

        select: {
            nome: true,
            email: true,
            descricao: true,
            website: true,
            criadoEm: true,
            username: true,

            _count: {
                select: {
                    publicacao: true
                }
            },

            publicacao: {
                select: {
                    _count: {
                        select: {
                            curtidas: true
                        }
                    }
                }
            }
        }
    });
};

exports.update = async(usuarioId, nome, email, descricao, website, username) => {
    return await prisma.usuario.update({
        where:{
            id: usuarioId
        },

        data:{
            ...(nome !== undefined && { nome }),
            ...(email !== undefined && { email }),
            ...(descricao !== undefined && { descricao }),
            ...(website !== undefined && { website }),
            ...(username !== undefined && { username })
        }
    })
}

exports.countUsuario = () => {
    return prisma.usuario.count()  
}

exports.countPost = () => {
    return prisma.publicacao.count()
}

exports.buscarPerfilPublico = async(usuarioId) => {
    return await prisma.usuario.findUnique({
        where: {
            id: usuarioId
        },

        select: {
            nome: true,
            descricao: true,
            website: true,
            criadoEm: true,
            username: true,
            publicacao: {
                select: {
                    id: true,
                    titulo: true,
                    descricao: true,
                    imagem: true
                }
            }
        }
    })
}


exports.findById = async(idUsuario) => {
    return await prisma.usuario.findUnique({
        where: {
            id: idUsuario
        }
    })
}

exports.update = async(idUsuario, novaSenhaHash) => {
    return await prisma.usuario.update({
        where: {
            id: idUsuario
        },

        data: {
            senha: novaSenhaHash
        }
    })
}