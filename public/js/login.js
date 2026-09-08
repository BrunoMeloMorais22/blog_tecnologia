
const API_URL = "http://localhost:3000"
const mensagem = document.getElementById("mensagem")

document.getElementById("loginFormulario").addEventListener("submit", async function(event) {
    event.preventDefault()

    const dados = {
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
    }

    const response = await fetch(`${API_URL}/users/login_user`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
    })

    const resultado = await response.json()

    if(response.ok){
        localStorage.setItem("token", resultado.data.token)

        mensagem.textContent = resultado.data.message
        mensagem.style.color = "green"

        setTimeout(() => {
            window.location.href = "/"
        }, 1500)
    } else{
        if(resultado.erros){
            mensagem.innerHTML = resultado.erros.map(erro=> erro.mensagem).join("<br>")
        } else{
            mensagem.textContent = resultado.error
        }

        mensagem.style.color = "red"
    }
})