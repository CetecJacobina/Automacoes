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
adicionarCheckboxLicoes();
criarBotaoExportar();
criarBarraProgresso();
