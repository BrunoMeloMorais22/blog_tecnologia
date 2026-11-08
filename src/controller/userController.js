
const postService = require('../service/postService')
const userService = require('../service/userService')
const AppError = require('../utils/AppError')
const { registerSchema } = require('../validator/userValidator')
const uploadImagem = require('../service/cloudinaryService');

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

        const { nome, email, descricao, website, username } = req.body

        const result = await userService.editarPerfil(
            usuarioId,
            nome, 
            email,
            descricao,
            website,
            username
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

exports.buscarPerfilPublico = async(req, res, next) => {
    const usuarioId  = Number(req.params.usuarioId)

    if(!Number.isInteger(usuarioId) || usuarioId <= 0){
       throw new AppError("ID do usuário inválido");
    }

    const resultado = await userService.buscarPerfilPublico(
        usuarioId
    )

    return res.status(200).json({
        success: true,
        data: resultado
    })
} 

exports.alterarSenha = async(req, res, next) => {
    try{
        const { senhaAtual, novaSenha, confirmarSenha } = req.body
        const idUsuario = req.usuario.id

        const resultado = await userService.alterarSenha(
            idUsuario,
            senhaAtual,
            novaSenha,
            confirmarSenha
        )

        return res.status(200).json({
            message: "Senha alterada com sucesso",
            data: resultado
        })
    }
    
    catch(erro){
        next(erro)
    }
}

exports.atualizarFotoPerfil = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error("Nenhuma imagem foi enviada");
        }

        const idUsuario = req.usuario.id;

        const imagem = await uploadImagem(
            req.file.buffer,
            'perfis'
        );

        const resultado = await userService.atualizarFotoPerfil(
            idUsuario,
            imagem.url
        );

        return res.status(200).json({
            message: "Foto atualizada com sucesso",
            data: resultado
        });

    } catch (erro) {
        next(erro);
    }
};