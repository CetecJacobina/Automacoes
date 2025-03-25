// Função para criar e adicionar o botão "Exportar Lição"
function criarBotaoExportar() {
    // Seleciona o container onde o botão será adicionado
    const containerBotoes = document.querySelector('.form-body');

    if (containerBotoes) {
        // Cria o botão
        const btnExportar = document.createElement("button");
        btnExportar.textContent = "Exportar Lição";
        btnExportar.style.padding = "10px";
        btnExportar.style.marginLeft = "10px"; // Adiciona uma margem para separar do botão "Atualizar"
        btnExportar.style.float = "right"; // Alinha o botão à direita

        // Adiciona o evento de clique ao botão
        btnExportar.addEventListener("click", exportarLicoes);

        // Seleciona o botão "Atualizar"
        const btnAtualizar = containerBotoes.querySelector('button#btnAtualizar');

        // Adiciona o botão "Exportar Lição" logo após o botão "Atualizar"
        if (btnAtualizar) {
            btnAtualizar.insertAdjacentElement('afterend', btnExportar);
        } else {
            console.log('Botão "Atualizar" não encontrado');
        }
    } else {
        console.log('Container com a classe "form-body" não encontrado');
    }
}

// Função para adicionar checkboxes para selecionar lições
function adicionarCheckboxLicoes() {
    const licoes = document.querySelectorAll("#shared-lists > .list-group-item.bg-grey");

    if (licoes.length === 0) {
        console.log("⚠️ Nenhuma lição encontrada.");
        return;
    }

    licoes.forEach(licao => {
        if (!licao.querySelector(".checkbox-licao")) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox-licao");
            checkbox.style.marginRight = "10px";

            licao.prepend(checkbox);
        }
    });

    console.log("✅ Checkboxes adicionados!");
}

// Função para obter as lições selecionadas
function obterLicoesSelecionadas() {
    const checkboxes = document.querySelectorAll(".checkbox-licao:checked");
    const licoesSelecionadas = [];

    checkboxes.forEach(checkbox => {
        const licao = checkbox.parentElement;
        const titulo = licao.innerText.trim().split("\n")[0];
        let proximoElemento = licao.nextElementSibling;

        if (proximoElemento && proximoElemento.classList.contains("lista")) {
            const itens = proximoElemento.querySelectorAll(".list-group-item");
            let itensLicao = [];

            itens.forEach(item => {
                const linkEditar = item.querySelector('a[href*="edit"]')?.href;
                const tipo = item.innerText.includes("Quiz") ? "Quiz" : "Conteúdo";

                if (linkEditar) {
                    itensLicao.push({ tipo, link: linkEditar });
                }
            });

            licoesSelecionadas.push({ titulo, itens: itensLicao });
        }
    });

    console.log("📚 Lições selecionadas:", licoesSelecionadas);
    return licoesSelecionadas;
}

// Função para obter conteúdo e exportar JSON
async function obterConteudoEExportarJson(url) {
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

        // Captura os títulos e o conteúdo do textarea
        const tituloAbreviado = doc.querySelector('input[name="titulo_abreviado"]')?.value || "Sem título abreviado";
        const titulo = doc.querySelector('input[name="titulo"]')?.value || "Sem título";
        const conteudoSummernote = doc.querySelector('textarea#summernote')?.value || "Sem conteúdo";

        return { tituloAbreviado, titulo, conteudo: conteudoSummernote };
    } catch (error) {
        console.error("❌ Erro ao obter o conteúdo:", error);
        return null;
    }
}

// Função para exportar lições selecionadas
async function exportarLicoes() {
    const licoes = obterLicoesSelecionadas();
    const dadosExportacao = [];

    for (const licao of licoes) {
        for (const item of licao.itens) {
            const dadosConteudo = await obterConteudoEExportarJson(item.link);
            if (dadosConteudo) {
                dadosExportacao.push({
                    tituloLicao: licao.titulo,
                    tipoItem: item.tipo,
                    ...dadosConteudo
                });
            }
        }
    }

    // Converte o objeto para uma string JSON
    const jsonString = JSON.stringify(dadosExportacao, null, 2);

    // Cria um blob com o JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const urlBlob = URL.createObjectURL(blob);

    // Cria um link para download
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = 'licoes.json';
    document.body.appendChild(a);
    a.click();

    // Remove o link após o download
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);

    console.log("📚 Lições exportadas com sucesso!");
}

// Executar no console para adicionar checkboxes e botão
adicionarCheckboxLicoes();
criarBotaoExportar();
