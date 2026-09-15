const express = require("express")
const router = express.Router()
const comentarController = require('../controller/comentarController')
const auth = require("../middleware/auth")

router.post("/:postId/comentarios", auth, comentarController.criarComentario)
router.get("/:postId/comentarios", comentarController.pegarComentarios)

module.exports = router