//Conseguiu exportar com sucesso uma disciplina.

// Função para criar e adicionar o botão "Exportar Lição"
function criarBotaoExportar() {
    const containerBotoes = document.querySelector('.form-body');

    if (containerBotoes) {
        const btnExportar = document.createElement("button");
        btnExportar.textContent = "Exportar Lição";
        btnExportar.style.padding = "10px";
        btnExportar.style.marginLeft = "10px";
        btnExportar.style.float = "right";

        btnExportar.addEventListener("click", function(event) {
    event.preventDefault(); // Impede que a página recarregue
    event.stopPropagation(); // Evita que outros eventos interfiram
    exportarLicoes();
});

        const btnAtualizar = containerBotoes.querySelector('button#btnAtualizar');
        if (btnAtualizar) {
            btnAtualizar.insertAdjacentElement('afterend', btnExportar);
        } else {
            console.log('⚠️ Botão "Atualizar" não encontrado');
        }
    } else {
        console.log('⚠️ Container com a classe "form-body" não encontrado');
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

// Função para obter conteúdo e exportar JSON de uma URL
async function obterConteudoEExportarJson(url) {
    try {
        // Garante que a URL tenha #/
        const urlFinal = url.includes("#/") ? url : url + "#/";

        console.log(`🔗 Buscando dados de: ${urlFinal}`);

        const response = await fetch(urlFinal, { credentials: "include" });

        if (!response.ok) {
            throw new Error(`❌ Erro ao carregar a página: ${response.status}`);
        }

        await new Promise(resolve => setTimeout(resolve, 5000)); // Aguarda 5s para garantir carregamento

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const tituloAbreviado = doc.querySelector('input[name="titulo_abreviado"]')?.value || "Sem título abreviado";
        const titulo = doc.querySelector('input[name="titulo"]')?.value || "Sem título";
        const conteudoSummernote = doc.querySelector('textarea#summernote')?.value || "Sem conteúdo";

        console.log(`✅ Dados obtidos para: ${titulo}`);

        return { tituloAbreviado, titulo, conteudo: conteudoSummernote };
    } catch (error) {
        console.error("❌ Erro ao obter o conteúdo:", error);
        return null;
    }
}

// Função para exportar lições selecionadas, processando uma por vez
async function exportarLicoes() {
    const licoes = obterLicoesSelecionadas();
    const dadosExportacao = [];

    for (const licao of licoes) {
        console.log(`📌 Processando lição: ${licao.titulo}`);

        for (const item of licao.itens) {
            console.log(`🔄 Buscando conteúdo para: ${item.tipo} - ${item.link}`);

            const dadosConteudo = await obterConteudoEExportarJson(item.link);
            if (dadosConteudo) {
                dadosExportacao.push({
                    tituloLicao: licao.titulo,
                    tipoItem: item.tipo,
                    ...dadosConteudo
                });
            }

            console.log(`✅ Concluído: ${item.tipo} - ${item.link}`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Espera 3s antes de continuar
        }
    }

    if (dadosExportacao.length === 0) {
        console.log("⚠️ Nenhuma lição exportada.");
        return;
    }

    const jsonString = JSON.stringify(dadosExportacao, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const urlBlob = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = 'licoes.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);

    console.log("📚 Exportação concluída com sucesso! 🎉");
}

// Adiciona checkboxes e botão de exportação ao carregar a página
adicionarCheckboxLicoes();
criarBotaoExportar();

// Testa buscar conteúdo com a URL corrigida
// obterConteudoEExportarJson("https://app.cgd.com.br/cursos-autoria/criador/item/84350/edit");
