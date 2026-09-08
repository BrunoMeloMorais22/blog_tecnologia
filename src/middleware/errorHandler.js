const { ZodError } = require('zod')

module.exports = (err, req, res, next) => {

    if(err instanceof ZodError){

        return res.status(400).json({
            success: false,
            errors: err.issues
        })

    }

    return res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Erro interno do servidor"
    })

}