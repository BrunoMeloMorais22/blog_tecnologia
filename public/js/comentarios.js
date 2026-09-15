
const socket = io()

async function enviarComentario(postId) {

    const input = document.getElementById(`comentario-${postId}`)

    const mensagem = input.value.trim()

    if (!mensagem) {
        return
    }

    const token = localStorage.getItem("token")

    const response = await fetch(
        `${API_URL}/comment/${postId}/comentarios`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                mensagem
            })
        }
    )

    const resultado = await response.json()

    console.log("STATUS:", response.status)
    console.log("RESPOSTA:", resultado)

    if (!response.ok) {
        console.error("Erro ao salvar comentário:", resultado)
        return
    }

    socket.emit("novo_comentario", {
        postId: postId,
        mensagem: mensagem
    })

    input.value = ""
}

socket.on("comentario_recebido", (comentario) => {

    const container = document.getElementById(
        `lista-comentarios-${comentario.postId}`
    )

    if (!container) return

    container.innerHTML += `
        <p>${comentario.mensagem}</p>
    `
})