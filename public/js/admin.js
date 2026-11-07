
const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");


console.log("JS carregado")
async function administrar() {
    const qtd_post = document.getElementById("qtd_post")
    const qtd_usuarios = document.getElementById("qtd_usuarios")

    try{
        if(!token){
            throw new Error("Usuário não autenticado");
        }

        const response = await fetch(`${API_URL}/users/admin`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(!response.ok){
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const resultado = await response.json()

        qtd_post.textContent = resultado.data.totalPost
        qtd_usuarios.textContent = resultado.data.totalUsuarios
    }

    catch(error) {
        console.error("Erro ao carregar painel administrativo", error)
    }
}

administrar()