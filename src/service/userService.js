const userRepository = require('../repositories/userRepository')
const bcrypt = require('bcrypt')
const AppError = require('../utils/AppError')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

exports.createUser = async(dadosValidados) => {   
    const { nome, email, senha, telefone, descricao, website, username } = dadosValidados
     
    const usuarioExiste = await userRepository.findByEmail(email)
    const usernameExiste = await userRepository.findByUsername(username)

    if(usuarioExiste) {
        throw new AppError("Usuário já existe")
    }

    if(usernameExiste){
        throw new AppError("Username já existe. Por favor, escolha outro apelido");
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await userRepository.create({
        nome, 
        email, 
        senha: senhaHash,
        telefone,
        descricao, 
        website,
        username
    })

    return {
        message: "Usuário criado com sucesso",
        id: usuario.id
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
        message: "Perfil atualizado com sucesso!",
        usuarioId: usuario.id
    }
}

exports.pegarInformacoes = async(usuarioId) => {
    const usuario = await userRepository.findByUserId(usuarioId)

    if(!usuario){
        throw new AppError("Usuário não encontrado", 404);
    }

    const totalCurtidas = usuario.publicacao.reduce((total, publicacao) => {
        return total + publicacao._count.curtidas
    }, 0)

    return {
        ...usuario,
        totalCurtidas
    }
}

exports.buscarInformacoes = async() => {
    const totalUsuarios = await userRepository.countUsuario()
    const totalPost = await userRepository.countPost()

    return{
        totalUsuarios,
        totalPost
    }
}   

exports.buscarPerfilPublico = async(usuarioId) => {
    const usuario = await userRepository.buscarPerfilPublico(usuarioId)

    if(!usuario){
       throw new AppError("Usuário não existe");
    }

    return {
        message: "Usuário encontrado",
        usuario
    }
}