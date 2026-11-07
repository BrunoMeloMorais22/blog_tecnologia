const API_URL = "http://localhost:3000"

const token = localStorage.getItem('token')

document.getElementById("postFormulario").addEventListener("submit", async function (event) {
    event.preventDefault()

    const form = document.getElementById("postFormulario")

    const formData = new FormData(form)

    const response = await fetch(`${API_URL}/posts/criar_post`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })

    const resultado = await response.json()

    const mensagem = document.getElementById("mensagem")

    if(response.ok){
        mensagem.textContent = resultado.data.message
        mensagem.style.color = "green";

        setTimeout(() => {
            window.location.href = "/"
        }, 1500)
    } else{
        if(resultado.erros) {
            mensagem.innerHTML = resultado.errors.map(erro => erro.mensagem).join("<br>")
        } else{
            mensagem.textContent = resultado.error
        }

        mensagem.style.color = "red"
    }
})