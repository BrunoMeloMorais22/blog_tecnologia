const express = require("express");
const path = require("path");
const userRoutes = require('./src/routes/userRoutes')
const postRoutes = require('./src/routes/postRoutes')
const errorHandler = require('./src/middleware/errorHandler')
const app = express();

app.use(express.json())

app.use(express.static(path.join(__dirname, "public")))


app.use("/upload", express.static(path.join(__dirname, "src", "upload")))

app.use("/users", userRoutes)
app.use("/posts", postRoutes)

app.use(errorHandler)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/index.html"))
})

app.get('/teste-erro', () => {
    throw new Error('Erro de teste do blog')
})

app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/cadastro.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/login.html"))
})

app.get("/criar_post", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/post.html"))
})



module.exports = app;