
const API_URL = "http://localhost:3000";

const token = localStorage.getItem("token");


async function carregarInformacoes() {
    const quantidade_post = document.getElementById("qtd_post")
    const nome = document.getElementById("nome")
    const email = document.getElementById("email")
    const descricao = document.getElementById("descricao")
    const website = document.getElementById("website")
    const membro_desde = document.getElementById("membro_desde")

    try{
        if(!token){
            throw new Error("Usuário não autenticado");            
        }

        const response = await fetch(`${API_URL}/users/perfil/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(!response.ok){
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const resultado = await response.json(); 

        console.log("Dados recebidos da API:", resultado);

        quantidade_post.textContent = resultado.data._count.publicacao

        const usuario = resultado.data

        const dataCadastro = new Date(usuario.criadoEm)

        const membroDesde = dataCadastro.toLocaleDateString("pt-BR", {
            month: "short",
            year: "numeric"
        })
        
        membro_desde.textContent = `Membro desde ${membroDesde}`
        nome.textContent = resultado.data.nome
        email.textContent = resultado.data.email
        descricao.textContent = resultado.data.descricao || "Conte um pouco sobre você...";
        website.textContent = resultado.data.website
    }

    catch(erro){
        console.error(erro)
    }
}

async function carregarPost() {
    try {
        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        const response = await fetch(`${API_URL}/users/perfil/meus_posts`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const resultado = await response.json(); 

        const container = document.querySelector(".card.posts-card");

        if (!container) {
            console.error("Contêiner dos posts não encontrado.");
            return;
        }

        container.innerHTML = "";

        resultado.data.forEach(publicacao => {
            const card = document.createElement("div");
            card.classList.add("post-card");

            card.innerHTML = `
                <h3>${publicacao.titulo}</h3>

                <p id="descricao-${publicacao.id}">
                    ${publicacao.descricao}
                </p>

                ${publicacao.imagem ? `
                    <img
                        src="${API_URL}/upload/${publicacao.imagem}"
                        alt="Imagem da publicação"
                    >
                ` : ""}
            `;

            container.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar os posts:", erro);
    }
}

function ativarEdicaoPerfil() {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const descricao = document.getElementById("descricao")
    const website = document.getElementById("website")

    const inputNome = document.getElementById("inputNome");
    const inputEmail = document.getElementById("inputEmail");
    const inputDescricao = document.getElementById("inputDescricao")
    const inputWebsite = document.getElementById("inputWebsite")

    const botaoEditar = document.querySelector(".botao-editar");

    inputNome.value = nome.textContent;
    inputEmail.value = email.textContent;
    inputDescricao.value = descricao.textContent
    inputWebsite.value = website.textContent

    nome.hidden = true;
    email.hidden = true;
    descricao.hidden = true;
    website.hidden = true;

    inputNome.hidden = false;
    inputEmail.hidden = false;
    inputDescricao.hidden = false;
    inputWebsite.hidden = false;

    botaoEditar.textContent = "Salvar edição";
}

function voltarVisualizacao() {
    document.getElementById("nome").hidden = false;
    document.getElementById("email").hidden = false;
    document.getElementById("descricao").hidden = false;
    document.getElementById("website").hidden = false;

    document.getElementById("inputNome").hidden = true;
    document.getElementById("inputEmail").hidden = true;
    document.getElementById("inputDescricao").hidden = true;
    document.getElementById("inputWebsite").hidden = true;

    document.querySelector(".botao-editar").textContent = "✎ Editar perfil";
}


async function editarPerfil() {
    const inputNome = document.getElementById("inputNome");
    const inputEmail = document.getElementById("inputEmail");
    const inputDescricao = document.getElementById("inputDescricao")
    const inputWebsite = document.getElementById("inputWebsite")
    const mensagem = document.getElementById("mensagem");

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const descricao = inputDescricao.value.trim()
    const website = inputWebsite.value.trim()

    try {
        if (!token) {
            throw new Error("Usuário não autenticado");
        }

        const response = await fetch(
            `${API_URL}/users/perfil/editar_perfil`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome, email, descricao, website })
            }
        );

        const resultado = await response.json();

        if (response.ok) {
            document.getElementById("nome").textContent = nome;
            document.getElementById("email").textContent = email;
            document.getElementById("descricao").textContent = descricao
            document.getElementById("website").textContent = website

            mensagem.textContent = resultado.data.message;
            mensagem.style.color = "green";

            voltarVisualizacao();
        } else {
            if (resultado.errors) {
                mensagem.textContent = resultado.errors
                    .map(erro => erro.message)
                    .join("\n");
            } else {
                mensagem.textContent =
                    resultado.error || "Não foi possível atualizar o perfil.";
            }

            mensagem.style.color = "red";
        }
    } catch (erro) {
        mensagem.textContent = erro.message || "Erro ao atualizar o perfil.";
        mensagem.style.color = "red";
    }
}

async function alternarEdicaoPerfil() {
    const botaoEditar = document.querySelector(".botao-editar");

    if (botaoEditar.textContent.includes("Salvar edição")) {
        await editarPerfil();
    } else {
        ativarEdicaoPerfil();
    }
}

carregarInformacoes()
carregarPost();
