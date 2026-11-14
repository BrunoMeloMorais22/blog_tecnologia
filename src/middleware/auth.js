
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");


module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: "Token não fornecido"
        });
    }

    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            error: "Formato de token inválido"
        })
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success: false,
            error: "Token não fornecido"
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const usuario = await userRepository.findById(decoded.id);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                error: "Usuário não encontrado"
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                success: false,
                error: "Token inválido"
            })
        }

        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                success: false,
                error: "Token expirado"
            })
        }

        next(error)
    }
};
