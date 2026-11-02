const express = require("express")
const router = express.Router()
const postController = require('../controller/postController')
const upload = require("../config/upload");
const auth = require("../middleware/auth")
const authOpcional = require("../middleware/authOpcional")

router.post("/criar_post", auth, upload.single("imagem"), postController.criarPost)
router.get("/pegar_posts", authOpcional, postController.pegarPosts)
router.put("/editar_post/:id", auth, postController.editarPost)
router.delete("/deletar_post/:id", auth, postController.deletarPost)
router.post("/:id/curtir", auth, postController.curtir)

module.exports = router