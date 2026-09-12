const express = require("express")
const router = express.Router()
const postController = require('../controller/postController')
const upload = require("../config/upload");
const auth = require("../middleware/auth")

router.post("/criar_post", auth, upload.single("imagem"), postController.criarPost)
router.get("/pegar_posts", postController.pegarPosts)

module.exports = router