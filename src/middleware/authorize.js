
module.exports = (rolePermitida) => {
    return (req, res, next) => {
        console.log("Usuário autenticado:", req.usuario);
console.log("Papel recebido:", req.usuario?.role);
console.log("Papel exigido:", rolePermitida);
        if(req.usuario.role !== rolePermitida) {
            return res.status(403).json({
                success: false,
                error: "Acesso negado"
            })
        }

        next()
    }
}