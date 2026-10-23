const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')
const rateLimit = require("../middleware/rateLimiter")
const auth = require("../middleware/auth")

router.post("/create_user", userController.createUser)
router.post("/login_user", rateLimit, userController.loginUser)
router.get("/perfil/meus_posts", auth, userController.perfilPosts)

module.exports = router