
const API_URL = `http://localhost:3000`

const token = localStorage.getItem("token")
const botoes = document.getElementById("botoes")

if(!token){
    botoes.style.display = "flex"
}

else{
    botoes.style.display = "none"
}

async function carregarPost() {
    const response = await fetch(`${API_URL}/posts/pegar_posts`)

    const resultado = await response.json()

    const container = document.getElementById("cards")

    container.innerHTML = "";

    resultado.data.forEach(publicacao => {
        container.innerHTML += `
    <div class="card">

        <img src="${API_URL}/upload/${publicacao.imagem}">

        <h3>${publicacao.titulo}</h3>

        <p>${publicacao.descricao}</p>

        <div class="card-acoes">
            <button>♡ Curtir</button>
            <button>💬 Comentar</button>
        </div>

    </div>
`
    });
}

carregarPost()

