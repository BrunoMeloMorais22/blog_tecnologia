
const { id } = require('zod/v4/locales')
const postService = require('../service/postService')
const { Prisma } = require('@prisma/client')

exports.criarPost = async(req, res, next) => {
    try{
        const { titulo, descricao } = req.body

        const imagem = req.file ? req.file.filename : null

        const usuarioId = req.usuario.id

        const result = await postService.criarPost(
            titulo, 
            descricao, 
            imagem,
            usuarioId
        )

        res.status(201).json({
            success: true,
            data: result
        })
    }

    catch(error) {
        next(error)
    }
}

exports.pegarPosts = async(req, res, next) => {
    try{
        const result = await postService.pegarPosts()

        res.status(200).json({
            success: true,
            data: result
        })
    } catch(error) {
        next(error)
    }
}   

exports.editarPost = async (req, res, next) => {
    try {
        const { descricao } = req.body

        const publicacaoId = Number(req.params.id)
        const usuarioId = req.usuario.id

        const result = await postService.editarPost(
            descricao,
            publicacaoId,
            usuarioId
        )

        return res.status(200).json({
            success: true,
            data: result
        })

    } catch (error) {
        next(error)
    }
}

exports.deletarPost = async (req, res, next) => {
    try {
        const publicacaoId = Number(req.params.id)
        const usuarioId = req.usuario.id

        const result = await postService.deletarPost(
            publicacaoId,
            usuarioId
        )

        return res.status(200).json({
            success: true,
            message: "Publicação deletada com sucesso!",
            data: result
        })

    } catch (error) {
        next(error)
    }
}

exports.deletarPost = async (req, res, next) => {
    try {
        const publicacaoId = Number(req.params.id)
        const usuarioId = req.usuario.id

        const result = await postService.deletarPost(
            publicacaoId,
            usuarioId
        )

        return res.status(200).json({
            success: true,
            message: "Publicação deletada com sucesso!",
            data: result
        })

    } catch (error) {
        next(error)
    }
}
