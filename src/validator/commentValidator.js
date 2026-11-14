const { z } = require('zod')

const comentarioSchema = z.object({
    mensagem: z
        .string()
        .trim()
        .min(1, "Comentário não pode estar vazio")
        .max(200, "Comentário deve ter no máximo 200 caracteres")
})

module.exports = {
    comentarioSchema
}