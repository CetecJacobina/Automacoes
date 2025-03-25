function listarLicoesEConteudos() {
    // Seleciona todas as lições
    const licoes = document.querySelectorAll("#shared-lists > .list-group-item.bg-grey");

    console.log(`📌 Total de lições encontradas: ${licoes.length}\n`);
    
    let dadosLicoes = [];

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
                const tituloItem = item.childNodes[2]?.textContent.trim() || "Sem título";
                const tipoItem = item.querySelector(".text-muted")?.innerText || "Sem categoria";
                const linkEditar = item.querySelector('a[href*="/edit"]')?.href || null;

                listaConteudos.push({
                    titulo: tituloItem,
                    tipo: tipoItem,
                    link: linkEditar
                });

                console.log(`   📌 ${tituloItem} (${tipoItem})`);
                console.log(`      🔗 Link: ${linkEditar || "❌ Não encontrado"}`);
            });

            proximoElemento = proximoElemento.nextElementSibling;
        }

        // Adiciona ao array final
        dadosLicoes.push({
            titulo: tituloLicao,
            itens: listaConteudos
        });

        console.log(""); // Quebra de linha para melhor visualização
    });

    return dadosLicoes;
}

// Executar no console do navegador:
const licoesColetadas = listarLicoesEConteudos();
console.log("📂 Lições Coletadas:", licoesColetadas);