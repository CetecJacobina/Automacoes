async function abrirPrimeiroConteudoEObterDados() {
    // Seleciona a primeira lição
    const licao = document.querySelector("#shared-lists > .list-group-item.bg-grey");

    if (!licao) {
        console.log("⚠️ Nenhuma lição encontrada.");
        return;
    }

    const tituloLicao = licao.innerText.split("\n")[0].trim(); // Pegando apenas o nome da lição
    console.log(`📚 Lição: ${tituloLicao}`);

    // Encontra o primeiro conteúdo dentro da lição
    const proximoElemento = licao.nextElementSibling;

    if (!proximoElemento || !proximoElemento.classList.contains("lista")) {
        console.log("⚠️ Nenhum conteúdo encontrado.");
        return;
    }

    // Coleta o primeiro item dentro dessa lição
    const item = proximoElemento.querySelector(".list-group-item");

    if (!item) {
        console.log("⚠️ Nenhum item encontrado.");
        return;
    }

    const tituloItem = item.childNodes[2]?.textContent.trim() || "Sem título";
    const tipoItem = item.querySelector(".text-muted")?.innerText || "Sem categoria";
    const linkEditar = item.querySelector('a[href*="edit"]')?.href || null;

    console.log(`   📌 ${tituloItem} (${tipoItem})`);
    
    if (!linkEditar) {
        console.log("⚠️ Link de edição não encontrado.");
        return;
    }

    // Abrir o link de edição em uma nova aba
    const novaAba = window.open(linkEditar, '_blank');

    if (!novaAba) {
        console.log("⚠️ Falha ao abrir a nova aba.");
        return;
    }

    // Verificar quando a nova aba estiver carregada
    const checkAba = setInterval(() => {
        if (novaAba.closed) {
            clearInterval(checkAba);
            console.log("⚠️ A aba foi fechada antes de carregar.");
        } else if (novaAba.document.readyState === "complete") {
            clearInterval(checkAba);
            console.log("📂 Página aberta com sucesso!");

            // Capturar os títulos e o conteúdo da nova aba
            setTimeout(() => {
                try {
                    const novoTitulo = novaAba.document.title || "Título não encontrado";
                    const conteudo = novaAba.document.querySelector('.note-editable')?.innerHTML.trim() || "Conteúdo não encontrado";

                    console.log(`📝 Título da Página: ${novoTitulo}`);
                    console.log(`📜 Conteúdo:\n${conteudo}`);
                } catch (error) {
                    console.log("⚠️ Erro ao acessar o conteúdo da nova aba. Pode ser uma restrição de segurança do navegador.");
                }
            }, 1000);
        }
    }, 500);
}

// Executar no console do navegador:
abrirPrimeiroConteudoEObterDados();
