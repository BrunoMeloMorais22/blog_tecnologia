
const comentarioRepository = require("../repositories/comentarioRepository")
const postRepository = require("../repositories/postRepository")
const AppError = require('../utils/AppError')

exports.criarComentario = async(mensagem, postId, usuarioId) => {
    const post = await postRepository.buscarPorId(postId)

    if(!post){
        throw new AppError("Post não encontrado", 404)
    }

    return comentarioRepository.criar(
        mensagem, 
        postId,
        usuarioId
    )
}

exports.pegarComentarios = async(postId) => {
    const post = await postRepository.buscarPorId(postId)

    if(!post){
        throw new AppError("Post não encontrado", 404)
    }

    return comentarioRepository.buscarPorPost(
        postId
    )
}