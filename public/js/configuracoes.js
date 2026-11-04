

const tema = document.getElementById("tema")
const temaSalvo = localStorage.getItem("tema")

if(temaSalvo === "dark"){
    document.body.classList.add("dark")
    tema.checked = true
}


tema.addEventListener("change", () => {
    if(tema.checked){
        document.body.classList.add("dark")
        localStorage.setItem("tema", "dark")
    }

    else{
        document.body.classList.remove("dark")
        localStorage.setItem("tema", "light")
    }
})


const idioma = document.getElementById("idioma");

idioma.value = localStorage.getItem("idioma") || "pt-BR";

idioma.addEventListener("change", (event) => {
    trocarIdioma(event.target.value);
});