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

        // Cria o objeto JSON com os dados
        const dados = {
            tituloAbreviado,
            titulo,
            conteudo: conteudoSummernote
        };

        // Converte o objeto para uma string JSON
        const jsonString = JSON.stringify(dados, null, 2);

        // Cria um blob com o JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const urlBlob = URL.createObjectURL(blob);

        // Cria um link para download
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = 'dados.json';
        document.body.appendChild(a);
        a.click();

        // Remove o link após o download
        document.body.removeChild(a);
        URL.revokeObjectURL(urlBlob);

        // Imprime o conteúdo no console
        console.log("📜 Conteúdo do Summernote:", conteudoSummernote);
    } catch (error) {
        console.error("❌ Erro ao obter o conteúdo do Summernote:", error);
    }
}

// 🔥 Testando com um link
obterConteudoEExportarJson("https://app.cgd.com.br/cursos-autoria/criador/item/84350/edit#/");
