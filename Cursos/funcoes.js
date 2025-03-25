// ENCONTRA AS LIÇÕES NA PAGINA

function contarLicoes() {
    // Seleciona todas as lições com base na estrutura da classe e tag usadas
    const licoes = document.querySelectorAll("#shared-lists > .list-group-item.bg-grey");

    console.log(`📌 Total de lições encontradas: ${licoes.length}`);

    // Exibe o nome das lições encontradas
    licoes.forEach((licao, index) => {
        console.log(`${index + 1}. ${licao.innerText.trim()}`);
    });
}

// Executar no console do navegador:
contarLicoes();




//////////////////////////////////////////
//////////////////////////////////////////




//  LISTAR OS CONTEUDOS DENTRO DE CADA LIÇÃO

function listarLicoesEConteudos() {
    // Seleciona todas as lições
    const licoes = document.querySelectorAll("#shared-lists > .list-group-item.bg-grey");

    console.log(`📌 Total de lições encontradas: ${licoes.length}\n`);

    licoes.forEach((licao, index) => {
        const tituloLicao = licao.innerText.split("\n")[0].trim(); // Pegando apenas o nome da lição
        console.log(`📚 ${index + 1}. ${tituloLicao}`);

        // Encontra os elementos dentro da lição
        let listaConteudos = [];
        let proximoElemento = licao.nextElementSibling;

        while (proximoElemento && proximoElemento.classList.contains("lista")) {
            // Coleta os conteúdos dentro dessa lição
            const itens = proximoElemento.querySelectorAll(".list-group-item");
            
            itens.forEach(item => {
                const tituloItem = item.childNodes[2].textContent.trim();
                const tipoItem = item.querySelector(".text-muted")?.innerText || "Sem categoria";
                listaConteudos.push(`   📌 ${tituloItem} (${tipoItem})`);
            });

            proximoElemento = proximoElemento.nextElementSibling;
        }

        // Exibe os conteúdos pertencentes à lição
        if (listaConteudos.length > 0) {
            listaConteudos.forEach(conteudo => console.log(conteudo));
        } else {
            console.log("   ⚠️ Nenhum conteúdo encontrado.");
        }

        console.log(""); // Quebra de linha para melhor visualização
    });
}

// Executar no console do navegador:
listarLicoesEConteudos();



//////////////////////////////////////////
//////////////////////////////////////////


async function obterDadosConteudoEQuiz(urls) {
    for (const url of urls) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            // Captura os valores dos inputs e textarea
            const tituloAbreviado = doc.querySelector("#titulo_abreviado")?.value || "Não encontrado";
            const titulo = doc.querySelector("#titulo")?.value || "Não encontrado";
            const conteudo = doc.querySelector("textarea.note-codable")?.value || "Não encontrado";

            console.log(`📄 Dados do link: ${url}\n`);
            console.log(`🔹 Título Abreviado: ${tituloAbreviado}`);
            console.log(`🔹 Título: ${titulo}`);
            console.log(`📜 Conteúdo:\n${conteudo}\n`);
        } catch (error) {
            console.error(`❌ Erro ao buscar conteúdo de ${url}:`, error);
        }
    }
}

// Lista de links de conteúdo e quiz
//const urls = [
    "https://app.cgd.com.br/cursos-autoria/criador/item/82572/edit",
    "https://app.cgd.com.br/cursos-autoria/criador/item/83114/edit",
    "https://app.cgd.com.br/cursos-autoria/criador/item/83116/edit",
    "https://app.cgd.com.br/cursos-autoria/criador/item/83200/edit",
    "https://app.cgd.com.br/cursos-autoria/criador/item/83202/edit",
    "https://app.cgd.com.br/cursos-autoria/criador/item/83204/edit",
    "https://app.cgd.com.br/cursos-autoria/criador/item/83207/edit",
    "https://app.cgd.com.br/cursos-autoria/criador/item/83208/edit"
//];

// Executar no console do navegador
obterDadosConteudoEQuiz(urls);



/// TESTE MACRO

// Função para contar lições e listar conteúdos com seus links de edição
function listarLicoesEConteudos() {
    const licoes = document.querySelectorAll("#shared-lists > .list-group-item.bg-grey");

    console.log(`📌 Total de lições encontradas: ${licoes.length}\n`);

    let urlsConteudoQuiz = [];

    licoes.forEach((licao, index) => {
        const tituloLicao = licao.innerText.split("\n")[0].trim(); // Pegando apenas o nome da lição
        console.log(`📚 ${index + 1}. ${tituloLicao}`);

        let proximoElemento = licao.nextElementSibling;
        let listaConteudos = [];

        while (proximoElemento && proximoElemento.classList.contains("lista")) {
            // Coleta os conteúdos dentro dessa lição
            const itens = proximoElemento.querySelectorAll(".list-group-item");

            itens.forEach(item => {
                const tituloItem = item.childNodes[2].textContent.trim();
                const tipoItem = item.querySelector(".text-muted")?.innerText || "Sem categoria";

                // Verifica se há link de edição e armazena
                const linkEdicao = item.querySelector("a[href*='/edit']")?.href;
                if (linkEdicao) {
                    urlsConteudoQuiz.push(linkEdicao);
                }

                listaConteudos.push(`   📌 ${tituloItem} (${tipoItem})`);
            });

            proximoElemento = proximoElemento.nextElementSibling;
        }

        if (listaConteudos.length > 0) {
            listaConteudos.forEach(conteudo => console.log(conteudo));
        } else {
            console.log("   ⚠️ Nenhum conteúdo encontrado.");
        }

        console.log(""); // Quebra de linha para melhor visualização
    });

    console.log("📌 Links coletados:", urlsConteudoQuiz);
    return urlsConteudoQuiz; // Retorna os links encontrados
}

// Função para obter dados de conteúdo e quiz a partir dos links coletados
async function obterDadosConteudoEQuiz(urls) {
    for (const url of urls) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            // Captura os valores dos inputs e textarea
            const tituloAbreviado = doc.querySelector("#titulo_abreviado")?.value || "Não encontrado";
            const titulo = doc.querySelector("#titulo")?.value || "Não encontrado";
            const conteudoDiv = document.querySelector('.note-editable')?.innerHTML || "Não encontrado";

            console.log(`📄 Dados do link: ${url}\n`);
            console.log(`🔹 Título Abreviado: ${tituloAbreviado}`);
            console.log(`🔹 Título: ${titulo}`);
            console.log(`📜 Conteúdo:\n${conteudo}\n`);
        } catch (error) {
            console.error(`❌ Erro ao buscar conteúdo de ${url}:`, error);
        }
    }
}

// Executa a busca de lições e coleta os links de edição
const urls = listarLicoesEConteudos();

// Aguarda um pouco e depois busca os dados dos conteúdos e quizzes
setTimeout(() => {
    obterDadosConteudoEQuiz(urls);
}, 2000);
