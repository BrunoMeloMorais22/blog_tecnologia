const rateLimit = require('express-rate-limit')
const logger = require("../utils/logger")


function normalizarIp(ip){
    if(ip?.startsWith("::ffff::")){
        return ip.substring(7)
    }

    if(ip === "::1"){
        return "127.0.0.1"
    }

    return ip
}

const limite = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    standardHeaders: true,
    legacyHeaders: false,


    handler: (req, res) => {
        const ip = normalizarIp(req.ip)
        const userAgent = req.get("User-Agent")

        logger.warn("RATE_LIMIT_EXCEEDED",{
            ip,
            userAgent,
            router: req.originalUrl
        })

        return res.status(429).json({
            message: "Muitas tentativas. Tente novamente mais tarde."
        })
    }
})

module.exports = limite