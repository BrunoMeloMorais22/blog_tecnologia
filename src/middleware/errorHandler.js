const { ZodError } = require('zod')

module.exports = (err, req, res, next) => {

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            errors: err.issues
        })
    }

    const statusCode = err.statusCode || 500

    if (statusCode === 500) {
        console.error(err)

        return res.status(500).json({
            success: false,
            error: "Erro interno do servidor"
        })
    }

    return res.status(statusCode).json({
        success: false,
        error: err.message || "Erro interno do servidor"
    })
}