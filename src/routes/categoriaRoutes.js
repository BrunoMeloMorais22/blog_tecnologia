const express = require("express")
const router = express.Router()
const categoriaController = require('../controller/categoriaController')

router.get('/', categoriaController.listarCategorias)
router.get('/:slug', categoriaController.pegarCategoria)

module.exports = router