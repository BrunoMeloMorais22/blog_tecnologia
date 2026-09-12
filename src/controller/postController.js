
const postService = require('../service/postService')

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
