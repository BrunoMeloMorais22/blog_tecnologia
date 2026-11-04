
const idiomaSalvo = localStorage.getItem("idioma") || "pt-BR";

const i18n = i18next.createInstance();

async function iniciarIdioma() {
    await i18n.init({
        lng: idiomaSalvo,
        fallbackLng: "pt-BR",

        resources: {
            "pt-BR": {
                translation: await fetch("/locales/pt-BR/translation.json").then(r => r.json())
            },
            "en": {
                translation: await fetch("/locales/en/translation.json").then(r => r.json())
            }
        }
    });

    traduzirPagina();
}

function traduzirPagina() {
    document.querySelectorAll("[data-i18n]").forEach(elemento => {
        const chave = elemento.getAttribute("data-i18n");
        elemento.textContent = i18n.t(chave);
    });
}

async function trocarIdioma(novoIdioma) {
    await i18n.changeLanguage(novoIdioma);

    localStorage.setItem("idioma", novoIdioma);

    traduzirPagina();
}

iniciarIdioma();
