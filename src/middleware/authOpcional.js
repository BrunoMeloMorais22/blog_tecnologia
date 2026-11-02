const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return next();
    }

    try {
        const token = authHeader.split(" ")[1];

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
        return res.status(401).json({
            success: false,
            error: "Token inválido ou expirado"
        });
    }
};