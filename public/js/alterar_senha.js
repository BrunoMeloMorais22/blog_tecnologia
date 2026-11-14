
const API_URL = `https://blog-tecnologia-ifup.onrender.com`
const mensagem = document.getElementById("mensagem")

const token = localStorage.getItem("token");

document.getElementById("formAlterarSenha").addEventListener("submit", async function(event) {
    event.preventDefault()

    const dados = {
        senhaAtual: document.getElementById("senhaAtual").value,
        novaSenha: document.getElementById("novaSenha").value,
        confirmarSenha: document.getElementById("confirmarSenha").value
    }

    const response = await fetch(`${API_URL}/users/alterar_senha`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })

    const resultado = await response.json()

    if(response.ok){
        mensagem.textContent = resultado.message
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