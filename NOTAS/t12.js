/// FAZ A FORMATAÇÃO PARA ALUNOS SEM NOTA.
/// CONSEGUIU EXPORTAR A LISTA FORNECIDA. Já PEGA O NOME DO ALUNO.

(async function () {
    // Carregar a biblioteca XLSX dinamicamente
    if (!window.XLSX) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => {
            script.onload = resolve; // Aguarda o carregamento da biblioteca
        });
        console.log("📚 Biblioteca XLSX carregada.");
    }

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

    // Função principal para realizar o fluxo combinado
    async function processarComUpload() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx";
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) {
                console.error("⚠️ Nenhum arquivo selecionado.");
                return;
            }

            const data = new Uint8Array(await file.arrayBuffer());
            const workbook = XLSX.read(data, { type: "array" });

            // Lê a primeira aba do arquivo XLSX
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Converte para JSON e extrai IDs
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            const ids = jsonData.map(row => row.id || "ID não encontrado");

            // Agora processe os dados dos IDs
            console.log("📋 IDs extraídos do arquivo:", ids);
            await processarDados(ids);
        };

        input.click();
    }

    async function processarDados(ids) {
        const baseUrl = "https://app.cgd.com.br/contratos/cursos-ead/xxxxxx/desempenho";
        const alunos = new Map();

        for (const id of ids) {
            const url = baseUrl.replace("xxxxxx", id);
            console.log(`🌐 Acessando URL: ${url}`);

            try {
                const response = await fetch(url, { method: "GET" });
                if (!response.ok) continue;

                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");

                // Extrai apenas o nome do aluno (sem idade e outros elementos)
                let nomeAluno = doc.querySelector("h3.page-title")?.childNodes[0].textContent.trim();
                nomeAluno = nomeAluno.replace(/\s+/g, " ").trim(); // Limpa espaços extras

                let linhas = doc.querySelectorAll("#dataTable tbody tr");

                if (!alunos.has(nomeAluno)) alunos.set(nomeAluno, []);

                let countQuiz = 0; // Inicializa a variável countQuiz antes de entrar no processamento das linhas
                linhas.forEach((linha) => {
                    let colunas = linha.querySelectorAll("td");
                    if (colunas.length < 4) return;

                    let titulo = colunas[0]?.textContent.trim();
                    let nota = colunas[2]?.textContent.trim().replace(",", ".").replace("%", "");
                    let tempo = colunas[3]?.textContent.trim();

                    if (/^\d+\./.test(titulo)) {
                        abaAtual = titulo.startsWith("1.");
                        return;
                    }

                    if (!abaAtual) return;

                    if (tempo && !/teste/i.test(titulo)) {
                        let partes = tempo.split(":").map(Number);
                        let minutos = partes[0] * 60 + partes[1];
                        minutos = Math.min(minutos, 15);
                        alunos.get(nomeAluno).push({ tempo: minutos, quiz: null });
                    }

                    if (/teste/i.test(titulo)) {
                        let matchNota = nota.match(/\d+(\.\d+)?/);
                        let quizNota = matchNota ? parseFloat(matchNota[0]) : 0;
                        if (countQuiz < alunos.get(nomeAluno).length) {
                            alunos.get(nomeAluno)[countQuiz].quiz = quizNota;
                        } else {
                            alunos.get(nomeAluno).push({ tempo: 0, quiz: quizNota });
                        }
                        countQuiz++; // Incrementa após processar o quiz
                    }
                });

            } catch (error) {
                console.error(`❌ Erro ao acessar ID ${id}:`, error);
            }
        }

        console.log("✅ Dados coletados:", alunos);
        criarETabelaExportar(alunos);
    }

    async function criarETabelaExportar(alunos) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Desempenho");

        // Adicionar cabeçalhos
        worksheet.addRow(["Aluno", "Quiz", "Tempo", "N1", "Quiz", "Tempo", "N2", "Quiz", "Tempo", "N3", "Quiz", "Tempo", "N4", "Total"]);
        worksheet.getRow(1).font = { bold: true };

        alunos.forEach((dados, aluno) => {
            const linha = [aluno];
            let total = 0;

            dados.forEach((dado) => {
                linha.push(formatarNumero(dado.quiz || 0)); // Trocar ponto por vírgula
                linha.push(formatarNumero(dado.tempo || 0)); // Trocar ponto por vírgula

                const parcial = (((dado.quiz || 0) / 100) * 40 + ((dado.tempo || 0) / 15) * 10) / 50 * (25 / 4);
                linha.push(formatarNumero(parcial)); // Trocar ponto por vírgula
                total += parcial;
            });

            while (linha.length < 13) linha.push("0,00"); // Preencher com zero formatado com vírgula
            linha.push(formatarNumero(total)); // Total com vírgula

            // Adiciona a linha à planilha
            const row = worksheet.addRow(linha);

            // Formatar linhas com Total = 0
            if (total === 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFFF0000" }, // Vermelho
                    };
                    cell.font = { color: { argb: "FFFFFFFF" } }; // Texto branco
                });
            }
        });

        // Exportar arquivo XLSX
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "desempenho_formatado.xlsx";
        link.click();

        console.log("📁 Planilha exportada: desempenho_formatado.xlsx");
    }

    // Função para formatar números com vírgula
    function formatarNumero(numero) {
        return numero.toFixed(2).toString().replace(".", ",");
    }

    // Executa a função combinada
    await processarComUpload();
})();
