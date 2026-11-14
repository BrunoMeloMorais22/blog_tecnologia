
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
    input.value = ""
}

socket.on("comentario_recebido", (comentario) => {
    renderizarComentario(comentario);
});

function renderizarComentario(comentario) {
    const container = document.getElementById(
        `lista-comentarios-${comentario.postId}`
    );

    if (!container || !comentario.usuario) return;

    const div = document.createElement("div");
    const img = document.createElement("img");
    const informacoes = document.createElement("div");
    const nome = document.createElement("h4");
    const username = document.createElement("span");
    const p = document.createElement("p");

    div.className = "comentario-item";
    img.className = "comentario-avatar";
    informacoes.className = "comentario-informacoes";
    nome.className = "comentario-nome";
    username.className = "comentario-username";
    p.className = "comentario-mensagem";

    img.src = comentario.usuario.fotoPerfil || "../img/fundojpg.jpg";
    img.alt = `Foto de perfil de ${comentario.usuario.nome}`;

    nome.textContent = comentario.usuario.nome;
    username.textContent = `@${comentario.usuario.username}`;
    p.textContent = comentario.mensagem;

    informacoes.appendChild(nome);
    informacoes.appendChild(username);

    div.appendChild(img);
    div.appendChild(informacoes);
    div.appendChild(p);

    container.appendChild(div);
}

async function carregarComentarios(postId) {
    const response = await fetch(`${API_URL}/comment/${postId}/comentarios`, {
        method: "GET",
    })

    if (!response.ok) {
        throw new Error("Erro ao carregar comentários");
    }

    const resultado = await response.json();

    resultado.data.forEach(comentario => {
        renderizarComentario(comentario)
    });
}
