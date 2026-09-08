const rateLimit = require('express-rate-limit')

const limite = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
        console.log("Bloqueado")

        return res.status(429).json({
            error: "Muitas tentativas."
        })
    }
})

module.exports = limite