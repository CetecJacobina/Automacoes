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

// Função para esperar a mudança no elemento
function esperarMudancaElemento(doc, seletor) {
    return new Promise((resolve) => {
        const elemento = doc.querySelector(seletor);

        if (elemento && elemento.value.trim() !== "") {
            resolve(elemento.value);
            return;
        }

        const observer = new MutationObserver(() => {
            const novoElemento = doc.querySelector(seletor);
            if (novoElemento && novoElemento.value.trim() !== "") {
                observer.disconnect();
                resolve(novoElemento.value);
            }
        });

        observer.observe(doc.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            resolve("Sem conteúdo carregado");
        }, 500);
    });
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

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Aguarda até que o conteúdo do textarea seja carregado
        const conteudoSummernote = await esperarMudancaElemento(doc, 'textarea#summernote');

        const tituloAbreviado = doc.querySelector('input[name="titulo_abreviado"]')?.value || "Sem título abreviado";
        const titulo = doc.querySelector('input[name="titulo"]')?.value || "Sem título";

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
            await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500ms antes de continuar
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

// Criar e exibir barra de progresso
function criarBarraProgresso() {
    const progressoDiv = document.createElement("div");
    progressoDiv.id = "progressoExportacao";
    progressoDiv.style.position = "fixed";
    progressoDiv.style.bottom = "10px";
    progressoDiv.style.right = "10px";
    progressoDiv.style.background = "#fff";
    progressoDiv.style.padding = "10px";
    progressoDiv.style.border = "1px solid #ccc";
    progressoDiv.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.2)";
    progressoDiv.style.zIndex = "1000";
    document.body.appendChild(progressoDiv);
    atualizarBarraProgresso(0, 0, 0, 0);
}

function atualizarBarraProgresso(licoesTotal, itensTotal, itensConcluidos, licoesConcluidas) {
    const progressoDiv = document.getElementById("progressoExportacao");
    progressoDiv.innerHTML = `
        <strong>Progresso da Exportação</strong><br>
        📚 Lições selecionadas: ${licoesTotal}<br>
        📝 Total de itens: ${itensTotal}<br>
        ✅ Itens concluídos: ${itensConcluidos}<br>
        🏁 Lições concluídas: ${licoesConcluidas}<br>
        ${licoesTotal > 0 && itensTotal === itensConcluidos ? "🎉 Concluído com sucesso!" : ""}
    `;
}

// Função para obter nome do curso
function obterNomeCurso() {
    const elementoCurso = document.querySelector(".portlet-body h4.col-12");
    if (elementoCurso) {
        return elementoCurso.textContent.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    }
    return "Curso_Desconhecido";
}

// Função para exportar lições selecionadas, processando uma por vez
async function exportarLicoes() {
    const licoes = obterLicoesSelecionadas();
    const dadosExportacao = [];
    let itensTotal = 0, itensConcluidos = 0, licoesConcluidas = 0;

    licoes.forEach(licao => itensTotal += licao.itens.length);
    atualizarBarraProgresso(licoes.length, itensTotal, 0, 0);

    for (const licao of licoes) {
        console.log(`📌 Processando lição: ${licao.titulo}`);
        let todosItensConcluidos = true;

        for (const item of licao.itens) {
            console.log(`🔄 Buscando conteúdo para: ${item.tipo} - ${item.link}`);
            const dadosConteudo = await obterConteudoEExportarJson(item.link);
            if (dadosConteudo) {
                dadosExportacao.push({
                    tituloLicao: licao.titulo,
                    tipoItem: item.tipo,
                    ...dadosConteudo
                });
                itensConcluidos++;
                atualizarBarraProgresso(licoes.length, itensTotal, itensConcluidos, licoesConcluidas);
            } else {
                todosItensConcluidos = false;
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        if (todosItensConcluidos) {
            licoesConcluidas++;
        }
        atualizarBarraProgresso(licoes.length, itensTotal, itensConcluidos, licoesConcluidas);
    }

    if (dadosExportacao.length === 0) {
        console.log("⚠️ Nenhuma lição exportada.");
        return;
    }

    const jsonString = JSON.stringify(dadosExportacao, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const urlBlob = URL.createObjectURL(blob);

    const nomeArquivo = obterNomeCurso() + '.json';
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);

    console.log("📚 Exportação concluída com sucesso! 🎉");
    atualizarBarraProgresso(licoes.length, itensTotal, itensTotal, licoes.length);
}

// Adiciona checkboxes e botão de exportação ao carregar a página
criarBarraProgresso();
