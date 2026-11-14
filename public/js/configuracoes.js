const API_URL = "https://blog-tecnologia-ifup.onrender.com";
const token = localStorage.getItem("token");

const tema = document.getElementById("tema");
const temaSalvo = localStorage.getItem("tema");
const mensagem = document.getElementById("mensagem");

if (temaSalvo === "dark") {
    document.body.classList.add("dark");
    tema.checked = true;
}

tema.addEventListener("change", () => {
    if (tema.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("tema", "dark");
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("tema", "light");
    }
});

const idioma = document.getElementById("idioma");

idioma.value = localStorage.getItem("idioma") || "pt-BR";

idioma.addEventListener("change", (event) => {
    trocarIdioma(event.target.value);
});

function excluirConta() {

    const exclusao = "EXCLUIR";

    const confirmacaoExclusao = document.getElementById("confirmacaoExclusao");
    const btnExcluirConta = document.getElementById("excluirConta");
    const modalExclusao = document.getElementById("modalExclusao");
    const cardExcluir = document.getElementById("cardExcluir");
    const cancelar = document.getElementById("cancelar");

    cardExcluir.addEventListener("click", () => {
        modalExclusao.classList.add("ativo");
    });

    cancelar.addEventListener("click", () => {
        modalExclusao.classList.remove("ativo");
    });

    confirmacaoExclusao.addEventListener("input", () => {

        if (confirmacaoExclusao.value === exclusao) {
            btnExcluirConta.disabled = false;
        } else {
            btnExcluirConta.disabled = true;
        }

    });
    btnExcluirConta.addEventListener("click", async () => {

        if (confirmacaoExclusao.value === exclusao) {

            btnExcluirConta.disabled = true;
            mensagem.textContent = "";

            try {

                const response = await fetch(`${API_URL}/users/deletar_usuario`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const resultado = await response.json();

                if (response.ok) {

                    mensagem.textContent = resultado.success;
                    mensagem.style.color = "green";

                    localStorage.removeItem("token");

                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 1500);

                } else {

                    if (resultado.errors) {
                        mensagem.textContent = resultado.errors
                            .map(erro => erro.message)
                            .join(" | ");
                    } else {
                        mensagem.textContent = resultado.error || "Não foi possível excluir sua conta.";
                    }

                    mensagem.style.color = "red";
                    btnExcluirConta.disabled = false;

                }

            } catch (erro) {

                console.error("Erro ao excluir conta:", erro);

                mensagem.textContent = "Erro de conexão com o servidor.";
                mensagem.style.color = "red";

                btnExcluirConta.disabled = false;

            }

        }

    });

}

excluirConta();