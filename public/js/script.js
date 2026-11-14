
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
    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/posts/pegar_posts`, {
        headers
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar publicações");
    }

    const resultado = await response.json();

    const container = document.getElementById("cards");

    container.textContent = "";

    function criarElemento(tag, classe, texto) {
        const elemento = document.createElement(tag);

        if (classe) {
            elemento.className = classe;
        }

        if (texto !== undefined) {
            elemento.textContent = texto;
        }

        return elemento;
    }

    function obterImagem(caminho, pasta, fallback) {
        if (!caminho || typeof caminho !== "string") {
            return fallback;
        }

        if (caminho.startsWith("https://")) {
            try {
                const url = new URL(caminho);

                if (url.protocol === "https:") {
                    return url.href;
                }
            } catch {
                return fallback;
            }

            return fallback;
        }


        if (
            caminho.includes("/") ||
            caminho.includes("\\") ||
            caminho === "." ||
            caminho === ".."
        ) {
            return fallback;
        }

        return `${API_URL}/upload/${pasta}/${encodeURIComponent(caminho)}`;
    }

    resultado.data.forEach(publicacao => {
        const postId = Number(publicacao.id);
        const usuarioId = Number(publicacao.usuarioId);

        if (
            !Number.isSafeInteger(postId) ||
            postId <= 0 ||
            !Number.isSafeInteger(usuarioId) ||
            usuarioId <= 0
        ) {
            return;
        }

        const donoDoPost =
            usuarioLogadoId !== null &&
            usuarioId === Number(usuarioLogadoId);

  
        const card = criarElemento("div", "card");


        const menuContainer = criarElemento("div", "menu-container");


        if (donoDoPost) {
            const menuAcoes = criarElemento("div", "menu-acoes");

            const menuBtn = criarElemento("button", "menu-btn", "⋮");
            menuBtn.type = "button";

            menuBtn.addEventListener("click", event => {
                abrirMenu(event, postId);
            });

            const menuOpcoes = criarElemento("div", "menu-opcoes");
            menuOpcoes.id = `menu-${postId}`;

            const botaoEditar = criarElemento(
                "button",
                "",
                "✏️ Editar Post"
            );

            botaoEditar.type = "button";
            botaoEditar.id = `editar-${postId}`;

            botaoEditar.addEventListener("click", () => {
                habilitarEdicao(postId);
            });

            const botaoDeletar = criarElemento(
                "button",
                "",
                "🗑️ Deletar Post"
            );

            botaoDeletar.type = "button";

            botaoDeletar.addEventListener("click", () => {
                deletar_post(postId);
            });

            menuOpcoes.appendChild(botaoEditar);
            menuOpcoes.appendChild(botaoDeletar);

            menuAcoes.appendChild(menuBtn);
            menuAcoes.appendChild(menuOpcoes);

            menuContainer.appendChild(menuAcoes);
        }

        const linkPerfil = criarElemento("a", "menu-btn-user");

        linkPerfil.href = `/perfil?id=${usuarioId}`;
        linkPerfil.title = "Acessar perfil";

        const fotoPerfil = criarElemento("img", "foto-perfil-post");

        fotoPerfil.src = obterImagem(
            publicacao.usuario?.fotoPerfil,
            "perfis",
            "../img/fundojpg.jpg"
        );

        fotoPerfil.alt = "Foto de perfil";

        linkPerfil.appendChild(fotoPerfil);
        menuContainer.appendChild(linkPerfil);

        card.appendChild(menuContainer);

        if (publicacao.imagem) {
            const imagemPost = criarElemento("img", "imagem-post");

            imagemPost.src = obterImagem(
                publicacao.imagem,
                "",
                ""
            );

            imagemPost.alt = "Imagem da publicação";

            imagemPost.addEventListener("error", () => {
                imagemPost.remove();
            });

            card.appendChild(imagemPost);
        }

        const nome = criarElemento(
            "p",
            "",
            publicacao.usuario?.nome || "Usuário"
        );


        const titulo = criarElemento(
            "h3",
            "",
            publicacao.titulo || ""
        );

        const descricao = criarElemento(
            "p",
            "",
            publicacao.descricao || ""
        );

        descricao.id = `descricao-${postId}`;

        card.appendChild(nome);
        card.appendChild(titulo);
        card.appendChild(descricao);


        const cardAcoes = criarElemento("div", "card-acoes");


        const botaoCurtir = criarElemento("button");
        botaoCurtir.id = `curtida-${postId}`;
        botaoCurtir.type = "button";

        const iconeCurtir = criarElemento("i");

        iconeCurtir.className =
            `${publicacao.curtidoPorMim ? "fa-solid" : "fa-regular"} fa-heart`;

        botaoCurtir.appendChild(iconeCurtir);
        botaoCurtir.appendChild(document.createTextNode(" Curtir"));

        botaoCurtir.addEventListener("click", () => {
            curtir(postId);
        });


        const botaoComentarios = criarElemento("button");
        botaoComentarios.type = "button";

        const iconeComentario = criarElemento(
            "i",
            "fa-solid fa-comment"
        );

        botaoComentarios.appendChild(iconeComentario);
        botaoComentarios.appendChild(
            document.createTextNode(" COMENTAR")
        );

        botaoComentarios.addEventListener("click", () => {
            abrirComentarios(postId);
        });

        cardAcoes.appendChild(botaoCurtir);
        cardAcoes.appendChild(botaoComentarios);

        card.appendChild(cardAcoes);


      const comentarios = criarElemento("div", "comentarios");

comentarios.id = `comentarios-${postId}`;
comentarios.style.display = "none";

const inputComentario = criarElemento("input");

inputComentario.type = "text";
inputComentario.id = `comentario-${postId}`;
inputComentario.placeholder = "Digite um comentário...";

const botaoEnviarComentario = criarElemento(
    "button",
    "",
    "Comentar"
);

botaoEnviarComentario.type = "button";

botaoEnviarComentario.addEventListener("click", () => {
    enviarComentario(postId);
});

const listaComentarios = criarElemento("div");

listaComentarios.id = `lista-comentarios-${postId}`;

comentarios.appendChild(inputComentario);
comentarios.appendChild(botaoEnviarComentario);
comentarios.appendChild(listaComentarios);

card.appendChild(comentarios);
container.appendChild(card);

carregarComentarios(postId).catch(erro => {
    console.error("Erro ao carregar comentários:", erro);
});

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
