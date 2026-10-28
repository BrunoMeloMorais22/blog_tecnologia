
const postService = require('../service/postService')
const userService = require('../service/userService')
const { registerSchema } = require('../validator/userValidator')

exports.createUser = async(req, res, next) => {
    try{

        const dadosValidados = registerSchema.parse(req.body)

        const result = await userService.createUser(
            dadosValidados
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

exports.loginUser = async(req, res, next) => {
    try{
        const {email, senha} = req.body

        const result = await userService.loginUser(
            email,
            senha
        )

        res.status(200).json({
            success: true,
            data: result
        })
    }

    catch(error) {
        next(error)
    }
}

exports.perfilPosts = async(req, res, next) => {
    try{
        const usuarioId = req.usuario.id

        const result = await userService.perfilPosts(
            usuarioId
        )

        res.status(200).json({
            success: true,
            data: result
        })
    }

    catch(erro){
        next(erro)
    }
}

exports.editarPerfil = async(req, res, next) =>{
    try{
        const usuarioId = req.usuario.id

        const { nome, email, descricao, website } = req.body

        const result = await userService.editarPerfil(
            usuarioId,
            nome, 
            email,
            descricao,
            website
        )

        res.status(200).json({
            success: true,
            data: result
        })
    }

    catch(erro){
        next(erro)
    }
}

exports.pegarPosts = async(req, res, next) => {
    try{
        const result = await postService.pegarPosts()

        res.status(200).json({
            success: true,
            data: result
        })
    } 
    
    catch(error) {
        next(error)
    }
}   

exports.perfilInformacoes = async(req, res, next) => {
    try{
        const usuarioId = req.usuario.id

        const result = await userService.pegarInformacoes(usuarioId)

        res.status(200).json({
            success: true,
            data: result
        })
    }

    catch(error) {
        next(error)
    }
}

exports.pegarInformacoes = async(req, res, next) => {
    try{
        const buscarInformacoes = await userService.buscarInformacoes()

        return res.status(200).json({
            success:true,
            data: buscarInformacoes
        })
    }

    catch(erro){
        next(erro)
    }
}