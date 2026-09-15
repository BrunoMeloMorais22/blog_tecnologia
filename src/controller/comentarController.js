
const comentarioService = require("../service/comentarioService")
const comentarioSchema = require("../validator/userValidator")

exports.criarComentario = async (req, res, next) => {
    try{
        const { mensagem } = comentarioSchema.parse(req.body)

        const { postId } = req.parms

        const usuarioId = req.usuarioId

        const result = await comentarioService.criarComentario(
            mensagem,
            Number(postId),
            usuarioId
        )

        res.status(201).json({
            mensagem: "Comentário publicado",
            data: result
        })
    }

    catch(error) {
        next(error)
    }
}