
const API_URL = `http://localhost:3000`

const token = localStorage.getItem("token")
const botoes = document.getElementById("botoes")

if(!token){
    botoes.style.display = "flex"
}

else{
    botoes.style.display = "none"
}

function abrirComentarios(postId) {
    const comentarios = document.getElementById(`comentarios-${postId}`)

    if(comentarios.style.display === "none"){
        comentarios.style.display = "block"
    }
    else{
        comentarios.style.display = "none"
    }
}

function habilitarEdicao(publicacaoId) {
    const descricao = document.getElementById(`descricao-${publicacaoId}`)

    const botao = document.getElementById(`editar-${publicacaoId}`)

    descricao.contentEditable = true
    descricao.focus()

    botao.innerText = "Salvar"
    botao.onclick = () => editar_post(publicacaoId)
}


async function editar_post(publicacaoId) {

    const descricaoElemento = document.getElementById(
        `descricao-${publicacaoId}`
    )

    const descricao = descricaoElemento.innerText

    const editar = await fetch(`${API_URL}/posts/editar_post/${publicacaoId}`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "Application/json"
        },

        body: JSON.stringify({
            descricao
        })
    }) 

    const result = await editar.json()

    if (!editar.ok) {
        alert(result.error)

        await carregarPost()

        return
    }

    descricaoElemento.contentEditable = false

    const botao = document.getElementById(`editar-${publicacaoId}`)

    botao.innerText = "Editar Post"
    botao.onclick = () => habilitarEdicao(publicacaoId)

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

            <div>
                <button id="editar-${publicacao.id}" onclick="habilitarEdicao(${publicacao.id})">Editar Post</button>
                <button onclick="deletar_post(${publicacao.id})">Deletar Post</button>
            </div>

            <p id="descricao-${publicacao.id}">
                ${publicacao.descricao}
            </p>

            <div class="card-acoes">
                <button>♡ Curtir</button>

                <button onclick="abrirComentarios(${publicacao.id})">
                    <i class="fa-solid fa-comment"></i>
                    COMENTAR
                </button>
            </div>

            <div
                class="comentarios"
                id="comentarios-${publicacao.id}"
                style="display: none;"
            >
                <input
                    type="text"
                    id="comentario-${publicacao.id}"
                    placeholder="Digite um comentário..."
                >

                <button onclick="enviarComentario(${publicacao.id})">Comentar</button>
            </div>
            <div id="lista-comentarios-${publicacao.id}"></div>
        </div>
    `
});

}
carregarPost()

