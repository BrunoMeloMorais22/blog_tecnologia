const express = require("express")
const router = express.Router()
const postController = require('../controller/postController')
const upload = require("../config/upload");
const auth = require("../middleware/auth")

router.post("/criar_post", auth, upload.single("imagem"), postController.criarPost)
router.get("/pegar_posts", postController.pegarPosts)
router.put("/editar_post/:id", auth, postController.editarPost)
router.delete("/deletar_post/:id", auth, postController.deletarPost)

module.exports = router