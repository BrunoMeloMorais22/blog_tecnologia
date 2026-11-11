
const API_URL = `http://localhost:3000`

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const usuarioId = Number(params.get("id"));
const perfilPublico = params.has("id");


async function carregarInformacoes() {
    const quantidade_post = document.getElementById("qtd_post")
    const quantidade_curtida = document.getElementById("qtd_curtida")
    const nome = document.getElementById("nome")
    const email = document.getElementById("email")
    const descricao = document.getElementById("descricao")
    const website = document.getElementById("website")
    const username = document.getElementById("username")
    const membro_desde = document.getElementById("membro_desde")
    const tituloPerfil = document.getElementById("titulo-perfil");
    const dinamico = document.getElementById("dinamico")

    const botaoEditar = document.querySelector(".botao-editar")
    const estatisticas = document.querySelector(".estatisticas")
    const sobreEmail = document.querySelector("#email").closest(".informacao-item")

    
    if (perfilPublico) {
        botaoEditar.style.display = "none"
        estatisticas.style.display = "none"
        sobreEmail.style.display = "none"
    }   
    

    try{
        if(!perfilPublico && !token){
            throw new Error("Usuário não autenticado");
            
        }
        const url = perfilPublico ? `${API_URL}/users/perfil/${usuarioId}` : `${API_URL}/users/perfil/me`

        const headers = {}

        if(!perfilPublico){
            headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(url, {
            headers
        })

        const resultado = await response.json(); 

        const usuario = perfilPublico ? resultado.data.usuario : resultado.data
        console.log("Foto recebida da API:", usuario.fotoPerfil);

        const avatar = document.querySelector(".avatar");

        if (usuario.fotoPerfil) {
    avatar.src = usuario.fotoPerfil.startsWith("https://")
        ? usuario.fotoPerfil
        : `${API_URL}/upload/perfis/${usuario.fotoPerfil}`;
} else {
    avatar.src = "../img/fundojpg.jpg";
}

        
        tituloPerfil.textContent = perfilPublico ? `Perfil de ${usuario.nome}` : "Meu perfil";
        dinamico.textContent = perfilPublico ? `Sobre ${usuario.nome}` : "Sobre mim"

        if(!response.ok){
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        console.log("Dados recebidos da API:", resultado);

        const dataCadastro = new Date(usuario.criadoEm)

        const membroDesde = dataCadastro.toLocaleDateString("pt-BR", {
            month: "short",
            year: "numeric"
        })
        
        nome.textContent = usuario.nome
        membro_desde.textContent = `Membro desde ${membroDesde}`
        username.textContent = usuario.username ? `@${usuario.username}` : "Username não definido";
        descricao.textContent = usuario.descricao || "Conte um pouco sobre você..."
        website.textContent = usuario.website || ""

        if (!perfilPublico) {
            email.textContent = resultado.data.email

            quantidade_post.textContent = resultado.data._count.publicacao
            quantidade_curtida.textContent = resultado.data.totalCurtidas
        }
    }

    catch(erro){
        console.error(erro)
    }
}


async function carregarPost() {

    try {
        let publicacoes;

        if (perfilPublico) {
            
            const response = await fetch(
                `${API_URL}/users/perfil/${usuarioId}`
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const resultado = await response.json();
            publicacoes = resultado.data.usuario.publicacao;

        } else {
            if (!token) {
                throw new Error("Usuário não autenticado.");
            }

            const response = await fetch(
                `${API_URL}/users/perfil/meus_posts`,
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
            publicacoes = resultado.data;
        }

        const container = document.querySelector(".card.posts-card");

        if (!container) {
            console.error("Contêiner dos posts não encontrado.");
            return;
        }

        container.innerHTML = "";

        publicacoes.forEach(publicacao => {
            const card = document.createElement("div");
            card.classList.add("post-card");

            card.innerHTML = `
                <h3>${publicacao.titulo}</h3>

                <p>${publicacao.descricao}</p>

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

async function atualizarFotoPerfil(formData) {
    try {
        const response = await fetch(`${API_URL}/users/atualizar_foto_perfil`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const resultado = await response.json();
        console.log("Retorno completo:", resultado);

        if (!response.ok) {
            throw new Error(resultado.error || "Erro ao atualizar foto");
        }

        const avatar = document.querySelector(".avatar");

        avatar.src = resultado.data.fotoPerfil ? resultado.data.fotoPerfil : "../img/fundojpg.jpg";

        console.log(resultado.message);

    } catch (erro) {
        console.error("Erro:", erro.message);
    }
}

function ativarUploadFoto() {
    if(perfilPublico) {
        return
    }
    
    const avatar = document.querySelector(".avatar");
    const fotoPerfil = document.getElementById("fotoPerfil");

    avatar.addEventListener("click", () => {
        fotoPerfil.click();
    });

    fotoPerfil.addEventListener("change", () => {
        const arquivo = fotoPerfil.files[0];

        if (!arquivo) return;

        const formData = new FormData();
        formData.append("fotoPerfil", arquivo);

        atualizarFotoPerfil(formData);
    });
}

ativarUploadFoto();

carregarInformacoes()
carregarPost();
