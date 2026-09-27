
const postRepository = require('../repositories/postRepository')
const AppError = require('../utils/AppError')
const logger = require('../utils/logger')


exports.criarPost = async (titulo, descricao, imagem, usuarioId) => {
    if (!titulo || !descricao) {
        throw new AppError(
            "Os campos: titulo e descricao são obrigatórios"
        )
    }

    try {
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

    } catch (error) {
        logger.error("POST_CREATE_FAILED", {
            usuarioId,
            error: error.message
        })

        throw error
    }
}

exports.pegarPosts = async() => {
    const posts = await postRepository.getPosts()

    return posts
}

exports.editarPost = async (descricao, publicacaoId, usuarioId) => {
    if (!descricao) {
        throw new AppError("Por favor, campo descrição obrigatório", 400)
    }

    const publicacao = await postRepository.buscarPorId(publicacaoId)

    if (!publicacao) {
        throw new AppError("Publicação não encontrada", 404)
    }

    if (publicacao.usuarioId !== usuarioId) {
        logger.warn('UNAUTHORIZED_POST_UPDATE', {
            usuarioId,
            publicacaoId
        })

        throw new AppError(
            "Você não tem permissão para editar essa publicação!",
            403
        )
    }

    try{
        return await postRepository.editarPost(
        publicacaoId,
        descricao
    )
    }

    catch (error){
        logger.error("POST_UPDATE_FAILED", {
            usuarioId,
            publicacaoId,
            error: error.message,
            code: error.code
        })

        throw error
    }
}


exports.deletarPost = async (publicacaoId, usuarioId) => {
    const publicacao = await postRepository.buscarPorId(publicacaoId)

    if (!publicacao) {
        throw new AppError("Publicação não encontrada", 404)
    }

    if (publicacao.usuarioId !== usuarioId) {

        logger.warn("UNAUTHORIZED_POST_DELETE", {
            usuarioId,
            publicacaoId
        })
        throw new AppError(
            "Você não tem permissão para deletar essa publicação!",
            403
        )
    }

    return await postRepository.deletarPost(publicacaoId)
}
