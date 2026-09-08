const userService = require('../service/userService')
const AppError = require('../utils/AppError')
const { registerSchema } = require('../validator/userValidator')

exports.createUser = async(req, res, next) => {
    try{

        registerSchema.parse(req.body)

        const { nome, email, senha, telefone } = req.body

        const result = await userService.createUser(
            nome, 
            email,
            senha,
            telefone
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
