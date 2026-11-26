const categoriaRepository = require("../repositories/categoriaRepository")
const AppError = require("../utils/AppError")

exports.pegarCategoria = async (slug) => {
    const categoria = await categoriaRepository.pegarCategoria(slug)

    if (!categoria) {
        throw new AppError("Categoria não encontrada", 404)
    }

    return categoria
}

exports.listarCategorias = async() => {
    const categorias = await categoriaRepository.listarCategorias()

    return categorias
}