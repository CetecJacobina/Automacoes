async function obterConteudoDaPagina(url) {
    try {
        const resposta = await fetch(url);
        const textoPagina = await resposta.text();

        // Criar um DOM temporário para analisar o HTML recebido
        const parser = new DOMParser();
        const doc = parser.parseFromString(textoPagina, "text/html");

        // Capturar título e conteúdo principal
        const titulo = doc.querySelector('input[name="titulo"]')?.value || "Sem título";
        const conteudoHTML = doc.querySelector("#conteudo")?.innerHTML || "Sem conteúdo";

        return {
            titulo: titulo,
            conteudo: conteudoHTML
        };
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro);
        return null;
    }
}

// 🔹 Teste com um dos links capturados
const linkTeste = "https://app.cgd.com.br/cursos-autoria/criador/item/84364/edit";
obterConteudoDaPagina(linkTeste).then(dados => console.log("📜 Conteúdo da Página:", dados));
