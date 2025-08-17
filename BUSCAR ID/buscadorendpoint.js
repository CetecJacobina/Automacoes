/*
retornou:
📌 Curso: Técnico em Eletromecânica EAD 5 | Nome: Agnaldo da Silva Pereira Filho | ID: 549350
📌 Curso: Técnico em Eletromecânica EAD 5 | Nome: Cristen Menezes Miranda | ID: 606817


*/


// Função para aguardar o endpoint "/andamento" estar disponível
async function esperarAndamento(url, maxTentativas = 10, intervalo = 2000) {
    let tentativas = 0;

    while (tentativas < maxTentativas) {
        try {
            console.log(`🔄 Tentativa ${tentativas + 1} de acessar: ${url}`);
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "text/html",
                    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                }
            });

            if (response.ok) {
                console.log(`✅ Endpoint disponível: ${url}`);
                return await response.text(); // Retorna o HTML caso tenha sucesso
            }
        } catch (error) {
            console.error(`⚠️ Erro ao tentar acessar ${url}: ${error.message}`);
        }

        tentativas++;
        await new Promise(resolve => setTimeout(resolve, intervalo));
    }

    throw new Error(`❌ Endpoint não disponível após ${maxTentativas} tentativas: ${url}`);
}

(async function () {
    const alunos = ["alunos", "Alunos"]; // Lista de alunos
    const cursoDesejado = "Técnico em Eletromecânica EAD 5"; // Nome do curso
    const resultados = []; // Lista para armazenar resultados

    for (const aluno of alunos) {
        const buscaUrl = `https://app.cgd.com.br/alunos?q=${encodeURIComponent(aluno)}`;
        console.log(`🌐 Buscando informações para: ${aluno}`);
        console.log(`🔗 URL de busca: ${buscaUrl}`);

        try {
            const response = await fetch(buscaUrl, { method: "GET", credentials: "include" });
            if (!response.ok) throw new Error(`Erro ao buscar aluno: ${response.statusText}`);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            const linhas = doc.querySelectorAll(
                "body > div > div.page-container > div.page-content-wrapper > div > div.portlet.light > div.portlet-body.form > table > tbody > tr:nth-child(1)"
            );
            console.log(`🔍 ${linhas.length} linhas encontradas na busca do aluno.`);

            for (const linha of linhas) {
                const nome = linha.querySelector("td:nth-child(1)")?.textContent.trim();
                console.log(`📄 Nome encontrado na linha: ${nome}`);
                if (!nome) continue;

                const links = linha.querySelectorAll("td:nth-child(2) > span.hidden-xs.hidden-sm > a");
                console.log(`🔗 ${links.length} links de contrato encontrados.`);

                for (const link of links) {
                    let contratoUrl = link.href.replace("/contratos/", "/contratos/cursos-ead/");
                    console.log(`🔄 URL modificada: ${contratoUrl}`);

                    const andamentoUrl = `${contratoUrl}/andamento`;
                    try {
                        const andamentoHtml = await esperarAndamento(andamentoUrl);
                        const andamentoDoc = new DOMParser().parseFromString(andamentoHtml, "text/html");
                        const cursos = andamentoDoc.querySelectorAll(
                            ".table-scrollable > table > tbody > tr"
                        );
                        console.log(`📚 ${cursos.length} cursos encontrados no contrato.`);

                        for (const curso of cursos) {
                            const cursoNome = curso.querySelector("td:nth-child(1)")?.textContent.trim();
                            console.log(`📖 Curso encontrado: ${cursoNome}`);
                            if (cursoNome !== cursoDesejado) continue;

                            const desempenhoLink = curso
                                .querySelector("td:nth-child(6) > div > a.btn.btn-outline.blue.btn-xs")
                                ?.href;
                            if (desempenhoLink) {
                                const idMatch = desempenhoLink.match(/\/(\d+)\/desempenho/); // Expressão para capturar o número
                                const id = idMatch ? idMatch[1] : "ID não encontrado";
                                console.log(`✅ Curso desejado encontrado!`);
                                console.log(`   ➡️ Link de desempenho: ${desempenhoLink}`);
                                console.log(`   📌 ID coletado: ${id}`);

                                resultados.push({ aluno, curso: cursoDesejado, id, link: desempenhoLink });
                            } else {
                                console.warn(`⚠️ Link de desempenho não encontrado para o curso: ${cursoNome}`);
                            }
                        }
                    } catch (error) {
                        console.error(`❌ Falha ao acessar o andamento: ${error.message}`);
                    }
                }
            }
        } catch (error) {
            console.error(`❌ Erro ao processar aluno ${aluno}: ${error.message}`);
        }
    }

    console.log("📊 Resultados finais:");
    if (resultados.length === 0) {
        console.warn("⚠️ Nenhum curso correspondente encontrado.");
    } else {
        resultados.forEach(({ aluno, curso, id }) => {
            console.log(`📌 Curso: ${curso} | Nome: ${aluno} | ID: ${id}`);
        });
    }
})();

// Função para aguardar o endpoint "/andamento" estar disponível
async function esperarAndamento(url, maxTentativas = 10, intervalo = 2000) {
    let tentativas = 0;

    while (tentativas < maxTentativas) {
        try {
            console.log(`🔄 Tentativa ${tentativas + 1} de acessar: ${url}`);
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "text/html",
                    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                }
            });

            if (response.ok) {
                console.log(`✅ Endpoint disponível: ${url}`);
                return await response.text(); // Retorna o HTML caso tenha sucesso
            }
        } catch (error) {
            console.error(`⚠️ Erro ao tentar acessar ${url}: ${error.message}`);
        }

        tentativas++;
        await new Promise(resolve => setTimeout(resolve, intervalo));
    }

    throw new Error(`❌ Endpoint não disponível após ${maxTentativas} tentativas: ${url}`);
}
