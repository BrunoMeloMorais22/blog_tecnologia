const userRepository = require('../repositories/userRepository')
const bcrypt = require('bcrypt')
const AppError = require('../utils/AppError')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

exports.createUser = async(dadosValidados) => {   
    const { nome, email, senha, telefone, descricao, website } = dadosValidados
     
    const usuarioExiste = await userRepository.findByEmail(email)

    if(usuarioExiste) {
        throw new AppError("Usuário já existe")
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuairo = await userRepository.create({
        nome, 
        email, 
        senha: senhaHash,
        telefone,
        descricao, 
        website
    })

    return {
        message: "Usuário criado com sucesso",
        id: usuairo.id
    }
}

exports.loginUser = async(email, senha) => {

    if(!email || !senha){
        throw new AppError("Preencha todos os campos", 404)
    }

    const usuario = await userRepository.findByEmail(email)

    if(!usuario){
        logger.warn('LOGIN_FAILED', {
        reason: 'USER_NOT_FOUND',
        email
    })
        throw new AppError("Usuário não existe", 401)
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    )

    if(!senhaValida){
        logger.warn('LOGIN_FAILED', {
        reason: 'INVALID_PASSWORD',
        email
    })
        throw new AppError("Email ou senha inválidos", 401)
    }

    const token = jwt.sign(
        {
            id: usuario.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    )
    
    logger.info('LOGIN_SUCCESS', {
        userId: usuario.id,
        email: usuario.email
    })

    return {
        message: "Login realizado com sucesso",
        token,
    }

}

exports.perfilPosts = async(usuarioId) => {
    const pegarPosts = await userRepository.findPostsByUserId(usuarioId)

    return pegarPosts
}

exports.editarPerfil = async(usuarioId, nome, email, descricao, website) => {
    const pegarUsuario = await userRepository.findByUserId(usuarioId)

    if(!pegarUsuario){
        throw new Error("Usuário não encontrado", 404);
    }

    if(!nome && !email){
        throw new AppError("Por favor, atualize ao menos 1 dos campos", 400)
    }

    if (nome !== undefined && !nome.trim()) {
        throw new AppError("Nome não pode ser vazio", 400);
    }

    const usuario = await userRepository.update(
        usuarioId,
        nome, 
        email,
        descricao,
        website
    )

    return {
        message: "Perfil atualizado com sucesos",
        usuarioId: usuario.id
    }
}

exports.pegarInformacoes = async(usuarioId) => {
    const usuario = await userRepository.findByUserId(usuarioId)

    if(!usuario){
        throw new AppError("Usuário não encontrado", 404);
    }

    return usuario
}

exports.buscarInformacoes = async() => {
    const totalUsuarios = await userRepository.countUsuario()
    const totalPost = await userRepository.countPost()

    return{
        totalUsuarios,
        totalPost
    }
}   
