const multer = require('multer')
const path = require('path')
const fs = require('fs')


const uploadDir = path.join(__dirname, "../upload")

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },

    filename: (req, file, cb) => {
        const nomeArquivo = Date.now() + path.extname(file.originalname)
        cb(null, nomeArquivo)
    }
})

const upload = multer({
    storage
})

module.exports = upload