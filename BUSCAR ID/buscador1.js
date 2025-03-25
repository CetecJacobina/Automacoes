// ORGANIZAR A ORDEM DA PLANILHA E EXCLUIR E URL

(async function () {
    const baseUrl = "https://app.cgd.com.br/contratos/cursos-ead/";
    const maxTentativas = 20; // Número máximo de tentativas
    const idInicial = 659600;
    const dadosAlunos = []; // Lista para armazenar os dados capturados

    // Carregar a biblioteca ExcelJS dinamicamente
    if (!window.ExcelJS) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => {
            script.onload = resolve; // Aguarda o carregamento da biblioteca
        });
        console.log("📚 Biblioteca ExcelJS carregada.");
    }

    for (let id = idInicial; id <= idInicial + maxTentativas; id++) {
        const url = `${baseUrl}${id}/desempenho`;
        console.log(`🌐 Tentando acessar URL: ${url}`);
        
        try {
            const response = await fetch(url, { method: "GET" });
            if (response.ok) {
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");

                // Captura o nome do aluno
                let nomeAluno = doc.querySelector("h3.page-title")?.childNodes[0].textContent.trim();
                nomeAluno = nomeAluno.replace(/\s+/g, " ").trim(); // Limpa espaços extras

                // Captura o curso
                let cursoElemento = doc.querySelector("body > div > div.page-container > div.page-content-wrapper > div > div:nth-child(9) > div.portlet-title > div");
                let curso = cursoElemento ? cursoElemento.textContent.trim() : null;
                if (curso) {
                    curso = curso.replace("Curso: ", "").trim(); // Remove o prefixo "Curso: "
                }

                // Valida se o conteúdo está presente
                if (nomeAluno && curso) {
                    // Adiciona os dados capturados à lista
                    dadosAlunos.push({ id, nome: nomeAluno, curso, url });
                    console.log(`✅ Capturado: ID=${id}, Nome=${nomeAluno}, Curso=${curso}`);
                } else {
                    console.log(`⚠️ Dados incompletos para o ID ${id}.`);
                }
            } else {
                console.log(`❌ ID inválido: ${id}`);
            }
        } catch (error) {
            console.error(`⚠️ Erro ao acessar URL com ID ${id}:`, error);
        }
    }

    console.log("🔍 Dados capturados:", dadosAlunos);

    // Exportar os dados capturados para um arquivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Alunos");

    // Adicionar cabeçalhos
    worksheet.addRow(["ID", "Nome", "Curso", "URL"]).font = { bold: true };

    // Preencher os dados
    dadosAlunos.forEach(({ id, nome, curso, url }) => {
        worksheet.addRow([id, nome, curso, url]);
    });

    // Salvar o arquivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dados_alunos.xlsx";
    link.click();

    console.log("📁 Planilha exportada: dados_alunos.xlsx");
})();
