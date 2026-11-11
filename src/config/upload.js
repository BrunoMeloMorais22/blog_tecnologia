const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/webp'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Formato de imagem não permitido'));
        }
    }
});

module.exports = upload;