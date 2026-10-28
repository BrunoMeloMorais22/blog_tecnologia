const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')
const rateLimit = require("../middleware/rateLimiter")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

router.post("/create_user", userController.createUser)
router.post("/login_user", rateLimit, userController.loginUser)
router.get("/perfil/meus_posts", auth, userController.perfilPosts)
router.put("/perfil/:id", auth, userController.editarPerfil)
router.get("/perfil/me", auth, userController.perfilInformacoes)
router.get("/admin", auth, authorize('ADMIN'), userController.pegarInformacoes)

module.exports = router