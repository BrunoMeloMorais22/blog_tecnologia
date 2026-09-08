
const API_URL = "http://localhost:3000"
const mensagem = document.getElementById("mensagem")

document.getElementById("cadastroFormulario").addEventListener("submit", async function(event) {
    event.preventDefault()

    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        telefone: document.getElementById("telefone").value
    }

    const response = await fetch(`${API_URL}/users/create_user`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
    })

    const resultado = await response.json()

    if(response.ok){
        mensagem.textContent = resultado.data.message
        mensagem.style.color = "green"

        setTimeout(() => {
            window.location.href = "/login"
        }, 1500)
    } else{
        if(resultado.errors){
            mensagem.innerHTML = resultado.errors.map(erro => erro.message).join("<br>")
        } else{
            mensagem.textContent = resultado.error
        }

        mensagem.style.color = "red"
    }
})