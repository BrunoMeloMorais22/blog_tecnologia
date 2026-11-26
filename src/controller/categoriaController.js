
const categoriaService = require("../service/categoriaService")

exports.pegarCategoria = async(req, res, next) => {
    try{
        const { slug } = req.params

        const categoria = await categoriaService.pegarCategoria(
            slug
        )

        res.status(200).json({
            success: true,
            data: categoria
        })
        }

    catch(error) {
        next(error)
    }
}

exports.listarCategorias = async(req, res, next) => {
    try{
        const categorias = await categoriaService.listarCategorias()

        res.status(200).json({
            success: true,
            data: categorias
        })
    }

    catch(error) {
        next(error)
    }
}