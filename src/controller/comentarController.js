const { obterIO } = require("../config/socket")
const comentarioService = require("../service/comentarioService")
const { comentarioSchema } = require("../validator/commentValidator")


exports.criarComentario = async (req, res, next) => {
    try{
        const { mensagem } = comentarioSchema.parse(req.body)

        const { postId } = req.params

        const usuarioId = req.usuario.id

        const result = await comentarioService.criarComentario(
            mensagem,
            Number(postId),
            usuarioId
        )

        const io = obterIO()

        io.emit("comentario_recebido", result)

        res.status(201).json({
            mensagem: "Comentário publicado",
            data: result
        })
    }

    catch(error) {
        next(error)
    }
}

exports.pegarComentarios = async (req, res, next) => {
    try{
        const { postId } = req.params

        const publicacao = await comentarioService.pegarComentarios(
            Number(postId)
        )


        res.status(200).json({
            mensagem: "Comentários recuperados",
            data: publicacao
        })
    }

    catch(erro){
        next(erro)
    }
}