// Função para esperar a mudança no elemento
function esperarMudancaElemento(seletor) {
    return new Promise((resolve) => {
        const elemento = document.querySelector(seletor);

        if (elemento && elemento.innerText.trim() !== "") {
            resolve(elemento.innerText);
            return;
        }

        // Observador para detectar mudanças no DOM
        const observer = new MutationObserver(() => {
            const novoElemento = document.querySelector(seletor);
            if (novoElemento && novoElemento.innerText.trim() !== "") {
                observer.disconnect();
                resolve(novoElemento.innerText);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Timeout de segurança de 5 segundos
        setTimeout(() => {
            observer.disconnect();
            resolve("Sem conteúdo carregado");
        }, 5000);
    });
}

// Função para obter dados da página e esperar o carregamento do conteúdo
async function obterDadosDaPagina(url) {
    try {
        console.log(`🔗 Buscando dados de: ${url}`);

        // Faz a requisição da página
        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) {
            throw new Error(`❌ Erro ao carregar a página: ${response.status}`);
        }

        // Obtém o HTML da página
        const html = await response.text();

        // Cria um documento DOM a partir do HTML recebido
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Captura os títulos imediatamente
        const tituloAbreviado = doc.querySelector('input[name="titulo_abreviado"]')?.value || "Sem título abreviado";
        const titulo = doc.querySelector('input[name="titulo"]')?.value || "Sem título";

        // Espera o carregamento do conteúdo do textarea
        const conteudo = await esperarMudancaElemento('main');

        return { tituloAbreviado, titulo, conteudo };

    } catch (error) {
        console.error("❌ Erro ao obter os dados:", error);
        return null;
    }
}

// 🔥 Testando com um link
obterDadosDaPagina("https://app.cgd.com.br/cursos-autoria/criador/item/84551/edit#/")
    .then(dados => {
        if (dados) {
            console.log("📌 Dados obtidos:", dados);
        } else {
            console.log("⚠️ Não foi possível obter os dados.");
        }
    });
