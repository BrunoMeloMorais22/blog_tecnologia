const temaSalvo = localStorage.getItem("tema") || "claro";

document.documentElement.setAttribute("data-theme", temaSalvo);

function alterarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);

    localStorage.setItem("tema", tema);
}