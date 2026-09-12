const postRepository = require('../repositories/postRepository')
const AppError = require('../utils/AppError')


exports.criarPost = async(titulo, descricao, imagem, usuarioId) => {
    if(!titulo || !descricao) {
        throw new AppError("Os campos: titulo e descricao são obrigatórios")
    }

    const post = await postRepository.criarPost({
        titulo,
        descricao,
        imagem,
        usuarioId
    })

    return {
        message: "Postagem criada",
        id: post.id
    }
}

exports.pegarPosts = async() => {
    const posts = await postRepository.getPosts()

    return posts
}