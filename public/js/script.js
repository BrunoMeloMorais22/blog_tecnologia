
const API_URL = `https://blog-tecnologia-ifup.onrender.com`

let token = localStorage.getItem("token");

function tokenValido() {
    if (!token) return false;

    try {
        const parteToken = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const payload = JSON.parse(atob(parteToken));

        if (!payload.exp) {
            localStorage.removeItem("token");
            token = null;
            return false;
        }

        const agora = Math.floor(Date.now() / 1000);

        if (agora >= payload.exp) {
            localStorage.removeItem("token");
            token = null;
            return false;
        }

        return true;

    } catch (erro) {
        localStorage.removeItem("token");
        token = null;
        return false;
    }
}

const botoes = document.getElementById("botoes");
const botaoMenu = document.getElementById("botaoMenu")

if (tokenValido()) {
    botoes.style.display = "none";
    botaoMenu.style.display = "flex"
} else {
    botoes.style.display = "flex";
    botaoMenu.style.display = "none"
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

async function deletar_post(publicacaoId) {
    const confirmar = confirm("Tem certeza que deseja deletar este post?");

    if (!confirmar) return;

    const response = await fetch(
        `${API_URL}/posts/deletar_post/${publicacaoId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const resultado = await response.json();

    if (!response.ok) {
        alert(resultado.error || "Erro ao deletar o post.");
        return;
    }

    alert("Post deletado com sucesso!");

    await carregarPost();
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

async function abrirMenu(event, id) {
    event.stopPropagation()
    
    const menu = document.getElementById(`menu-${id}`)

    document.querySelectorAll(".menu-opcoes").forEach(item => {
        if(item !== menu){
            item.classList.remove("ativo")
        }
    })

    menu.classList.toggle("ativo")
}

document.addEventListener("click", (event) => {
    if(!event.target.closest("menu-container")){
        document.querySelectorAll(".menu-opcoes").forEach(menu => {
            menu.classList.remove("ativo")
        })
    }
})


function obterUsuarioLogado() {
    if (!token) return null;

    try {
        const parteToken = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const payload = JSON.parse(atob(parteToken));

        return payload.id ?? null;
    } catch (erro) {
        console.error("Não foi possível ler o token:", erro);
        return null;
    }
}

const usuarioLogadoId = obterUsuarioLogado();

async function carregarPost() {
    const headers = {}

    if(token){
        headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(`${API_URL}/posts/pegar_posts`, {
        headers
    });

    const resultado = await response.json();

    const container = document.getElementById("cards");

    container.innerHTML = "";

    resultado.data.forEach(publicacao => {
        const donoDoPost =
            usuarioLogadoId !== null &&
            Number(publicacao.usuarioId) === Number(usuarioLogadoId);

        container.innerHTML += `
    <div class="card">

        <div class="menu-container">

    ${donoDoPost ? `
        <div class="menu-acoes">

            <button
                class="menu-btn"
                onclick="abrirMenu(event, ${publicacao.id})">
                ⋮
            </button>

            <div class="menu-opcoes" id="menu-${publicacao.id}">

                <button
                    id="editar-${publicacao.id}"
                    onclick="habilitarEdicao(${publicacao.id})">
                    ✏️ Editar Post
                </button>

                <button onclick="deletar_post(${publicacao.id})">
                    🗑️ Deletar Post
                </button>

            </div>
        </div>
    ` : ""}

    <a href="/perfil?id=${publicacao.usuarioId}" class="menu-btn-user" title="Acessar perfil">
        <i class="fa-solid fa-user"></i>
    </a>

</div>

        <img src="${API_URL}/upload/${publicacao.imagem}">
        <p>${publicacao.usuario.nome}</p>

        <h3>${publicacao.titulo}</h3>

        <p id="descricao-${publicacao.id}">
            ${publicacao.descricao}
        </p>

        <div class="card-acoes">
            <button id="curtida-${publicacao.id}" onclick="curtir(${publicacao.id})">
                <i class="${publicacao.curtidoPorMim ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                Curtir
            </button>

            <button onclick="abrirComentarios(${publicacao.id})">
                <i class="fa-solid fa-comment"></i>
                COMENTAR
            </button>
        </div>

        <div class="comentarios"
             id="comentarios-${publicacao.id}"
             style="display: none;">
            <input
                type="text"
                id="comentario-${publicacao.id}"
                placeholder="Digite um comentário...">

            <button onclick="enviarComentario(${publicacao.id})">
                Comentar
            </button>
        </div>

        <div id="lista-comentarios-${publicacao.id}"></div>

    </div>
`;
    });
}

carregarPost()

function abrirFechar() {
    const sidebar = document.querySelector(".sidebar");
    const botao = document.getElementById("botaoMenu");

    sidebar.classList.toggle("fechada");

    const fechada = sidebar.classList.contains("fechada");

    botao.style.display = fechada ? "block" : "none";
}


async function curtir(publicacaoId) {
    const botao = document.getElementById(`curtida-${publicacaoId}`);

    if (!botao) return;

    if (!token) {
        alert("Você precisa estar logado para curtir uma publicação.");
        return;
    }

    try {
        const result = await fetch(
            `${API_URL}/posts/${publicacaoId}/curtir`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const resultado = await result.json();

        if (!result.ok) {
            alert(
                resultado.message ||
                resultado.error ||
                "Erro ao curtir publicação"
            );
            return;
        }

        const coracao = botao.querySelector("i");

        if (resultado.curtida) {
            coracao.classList.remove("fa-regular");
            coracao.classList.add("fa-solid");
        } else {
            coracao.classList.remove("fa-solid");
            coracao.classList.add("fa-regular");
        }
    } catch (erro) {
        console.error("Erro ao curtir:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
}
