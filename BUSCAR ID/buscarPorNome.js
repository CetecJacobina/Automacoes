// Função para aguardar o carregamento de um elemento
function esperarElemento(seletor, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const intervalo = 100; // Intervalo entre verificações (em ms)
        let tempoDecorrido = 0;

        const verificar = setInterval(() => {
            const elemento = document.querySelector(seletor);
            if (elemento) {
                clearInterval(verificar); // Parar o intervalo
                resolve(elemento); // Retorna o elemento encontrado
            } else if (tempoDecorrido >= timeout) {
                clearInterval(verificar);
                reject(new Error(`Elemento ${seletor} não foi encontrado dentro do tempo limite.`));
            }
            tempoDecorrido += intervalo;
        }, intervalo);
    });
}

(async function () {
    const alunos = ["Agnaldo da Silva Pereira Filho", "Cristen Menezes Miranda"]; // Lista de alunos
    const cursoDesejado = "Técnico em Eletromecânica EAD 5"; // Nome do curso a ser validado
    const baseUrlBusca = "https://app.cgd.com.br/cursos-ead/alunos?q=";
    const resultados = []; // Lista para armazenar resultados finais

    // Carregar a biblioteca ExcelJS dinamicamente
    if (!window.ExcelJS) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => (script.onload = resolve));
        console.log("📚 Biblioteca ExcelJS carregada.");
    }

    for (const aluno of alunos) {
        const buscaUrl = `${baseUrlBusca}${encodeURIComponent(aluno)}`;
        console.log(`🌐 Buscando aluno: ${aluno} em ${buscaUrl}`);

        try {
            const response = await fetch(buscaUrl);
            if (response.ok) {
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");

                // Localizar botões de contratos
                const botoesContratos = doc.querySelectorAll("body > div > div.page-container > div.page-content-wrapper > div > div.portlet.light > div.portlet-body.form > table > tbody > tr > td:nth-child(2) > span.hidden-xs.hidden-sm > a");

                for (const botaoContrato of botoesContratos) {
                    let contratoUrl = botaoContrato.href; // URL original do contrato
                    console.log(`➡️ Contrato original encontrado: ${contratoUrl}`);

                    // Modificar URL para acessar cursos-ead
                    if (!contratoUrl.includes("/cursos-ead/")) {
                        contratoUrl = contratoUrl.replace("/contratos/", "/contratos/cursos-ead/");
                    }
                    console.log(`🔄 URL modificada: ${contratoUrl}`);

                    const contratoResponse = await fetch(contratoUrl);
                    if (contratoResponse.ok) {
                        const contratoHtml = await contratoResponse.text();
                        const contratoDoc = new DOMParser().parseFromString(contratoHtml, "text/html");

                        // Aguarda o carregamento da tabela de cursos
                        try {
                            const tabela = await esperarElemento("#cursos_andamento > div.table-scrollable > table > tbody");
                            console.log("✅ Tabela encontrada, processando...");

                            // Capturar todos os cursos da tabela
                            const cursos = Array.from(tabela.querySelectorAll("tr")).map((linha, index) => {
                                const colunas = Array.from(linha.querySelectorAll("td")).map(celula => celula.textContent.trim());
                                console.log(`Linha ${index + 1}:`, colunas); // Exibe cada linha no console
                                return colunas[0]; // Retorna o nome do curso (primeira coluna)
                            }).filter(curso => curso);

                            console.log(`📋 Cursos encontrados para ${aluno}:`, cursos);

                            // Validar o curso desejado
                            if (cursos.includes(cursoDesejado)) {
                                const idContrato = contratoUrl.match(/\/(\d+)\/cursos-ead/)?.[1] || "ID não encontrado";
                                console.log(`✅ Curso válido encontrado para ${aluno}: ${cursoDesejado}, ID: ${idContrato}`);

                                resultados.push({ aluno, curso: cursoDesejado, id: idContrato, url: contratoUrl });
                            } else {
                                console.warn(`⚠️ Curso desejado "${cursoDesejado}" não encontrado na tabela para ${aluno}.`);
                            }
                        } catch (error) {
                            console.warn(`⚠️ Falha ao esperar pela tabela em ${contratoUrl}: ${error.message}`);
                        }
                    } else {
                        console.error(`❌ Erro ao acessar contrato modificado: ${contratoResponse.statusText}`);
                    }
                }
            } else {
                console.error(`❌ Erro ao buscar aluno ${aluno}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`⚠️ Erro ao processar busca para aluno ${aluno}:`, error);
        }
    }

    console.log("🔍 Resultados finais:", resultados);

    // Exportar resultados para Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Alunos e Cursos");
    worksheet.addRow(["Aluno", "Curso", "ID Contrato", "URL"]).font = { bold: true };

    resultados.forEach(({ aluno, curso, id, url }) => {
        worksheet.addRow([aluno, curso, id, url]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "alunos_cursos.xlsx";
    link.click();

    console.log("📁 Planilha exportada: alunos_cursos.xlsx");
})();