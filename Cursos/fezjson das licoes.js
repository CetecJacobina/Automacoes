async function coletarItensDaLicao() {
    const licao = document.querySelector("#shared-lists > .list-group-item.bg-grey");

    if (!licao) {
        console.log("⚠️ Nenhuma lição encontrada.");
        return;
    }

    const tituloLicao = licao.innerText.split("\n")[0].trim();
    console.log(`📚 Lição: ${tituloLicao}`);

    let proximoElemento = licao.nextElementSibling;
    let itensColetados = [];

    if (proximoElemento && proximoElemento.classList.contains("lista")) {
        const itens = proximoElemento.querySelectorAll(".list-group-item");

        for (const item of itens) {
            const linkEditar = item.querySelector('a[href*="edit"]')?.href;

            if (!linkEditar) {
                console.log("⚠️ Link de edição não encontrado.");
                continue;
            }

            console.log(`🔗 Obtendo dados de: ${linkEditar}`);
            try {
                const dados = await obterDadosConteudo(linkEditar);
                if (dados) {
                    itensColetados.push(dados);
                }
            } catch (erro) {
                console.error(`❌ Erro ao coletar dados de ${linkEditar}:`, erro.message);
            }
        }

        console.log("✅ Coleta finalizada. Salvando JSON...");
        salvarJSON({ licao: tituloLicao, itens: itensColetados });
    } else {
        console.log("⚠️ Nenhum conteúdo encontrado.");
    }
}

// Função para obter dados do conteúdo sem abrir uma nova aba
async function obterDadosConteudo(url) {
    try {
        console.log(`🕵️‍♂️ Iniciando busca do conteúdo de: ${url}`);

        const response = await fetch(url, {
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html',
            },
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        console.log(`📄 HTML carregado com sucesso de: ${url}`);

        const titulo = doc.querySelector('input[name="titulo"]')?.value.trim() || "Título não encontrado";
        const tituloAbreviado = doc.querySelector('input[name="titulo_abreviado"]')?.value.trim() || "Sem título abreviado";
        const conteudo = doc.querySelector('.note-editable')?.innerHTML || "Não encontrado";

        console.log(`📌 ${titulo} (${tituloAbreviado})`);
        console.log(`📜 Conteúdo: ${conteudo.substring(0, 50)}...`);

        console.log(`🕵️‍♂️ Busca do conteúdo de ${url} finalizada com sucesso.`);

        return { titulo, tituloAbreviado, conteudo };
    } catch (erro) {
        console.error(`❌ Erro ao obter dados do conteúdo: ${erro.message}`);
        throw erro;
    }
}

// Salvar JSON como arquivo
function salvarJSON(dados) {
    const json = JSON.stringify(dados, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "licao_conteudos.json";
    link.click();

    console.log("📂 Arquivo JSON salvo com sucesso!");
}

// Executar no console do navegador:
coletarItensDaLicao();
