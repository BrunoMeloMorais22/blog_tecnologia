
const cloudinary = require('../config/cloudinary');

console.log({
    cloudName: cloudinary.config().cloud_name,
    apiKeyConfigurada: !!cloudinary.config().api_key,
    apiSecretConfigurado: !!cloudinary.config().api_secret
});

const uploadImagem = (buffer, pasta) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `devblog/${pasta}`,
                resource_type: 'image'
            },
            (erro, resultado) => {
    if (erro) {
        console.dir(erro, { depth: 10 });
        return reject(erro);
    }

    resolve({
        url: resultado.secure_url,
        publicId: resultado.public_id
    });
}
        );

        stream.end(buffer);
    });
};

module.exports = uploadImagem;
