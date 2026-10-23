
const API_URL = "http://localhost:3000";

const token = localStorage.getItem("token");

function editarPerfil(){
    
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

carregarPost();
