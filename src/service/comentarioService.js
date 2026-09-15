
const comentarioRepository = require("../repositories/comentarioRepository")
const AppError = require('../utils/AppError')

exports.criarComentario = async(mensagem, postId, usuarioId) => {
    const post = await comentarioRepository.buscarPorId(postId)

    if(!post){
        throw new AppError("Post não encontrado", 404)
    }

    return comentarioRepository.criar(
        mensagem, 
        postId,
        usuarioId
    )
}