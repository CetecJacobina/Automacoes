(async function () {
    const ids = [659601, 659602, 659603, 659604]; // Lista de IDs para substituir no URL
    const baseUrl = "https://app.cgd.com.br/contratos/cursos-ead/xxxxxx/desempenho";

    // Certifica-se de que a biblioteca XLSX está carregada
    if (!window.XLSX) {
        let script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = () => processarDados(ids);
        document.body.appendChild(script);
    } else {
        processarDados(ids);
    }

    async function processarDados(ids) {
        const alunos = new Map(); // Associamos os dados de cada aluno pelo nome

        for (const id of ids) {
            const url = baseUrl.replace("xxxxxx", id); // Substitui xxxxxx pelo ID atual
            console.log(`🌐 Acessando URL: ${url}`);

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Adicione cabeçalhos de autenticação, se necessário
                    }
                });

                if (!response.ok) {
                    console.error(`❌ Erro ao acessar ID ${id}: Status ${response.status}`);
                    continue;
                }

                const html = await response.text(); // Obtém o conteúdo retornado
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                const nomeAluno = doc.querySelector(".aluno-nome")?.textContent.trim() || `Aluno ${id}`; // Nome do aluno
                const linhas = doc.querySelectorAll("#dataTable tbody tr");

                console.log(`📋 Extraindo dados para o aluno: ${nomeAluno}...`);

                if (!alunos.has(nomeAluno)) {
                    alunos.set(nomeAluno, []); // Inicializa os dados do aluno
                }

                linhas.forEach((linha) => {
                    const colunas = linha.querySelectorAll("td");
                    if (colunas.length < 4) return;

                    const titulo = colunas[0]?.textContent.trim();
                    const nota = colunas[2]?.textContent.trim().replace(",", ".").replace("%", "");
                    const tempo = colunas[3]?.textContent.trim();

                    // Processa os dados das colunas
                    const tempoMinutos = tempo
                        ? tempo.split(":").reduce((acc, time) => acc * 60 + parseInt(time, 10), 0)
                        : 0;

                    alunos.get(nomeAluno).push({
                        titulo,
                        quiz: parseFloat(nota) || 0,
                        tempo: Math.min(tempoMinutos, 15) // Limita o tempo a 15 minutos
                    });
                });
            } catch (error) {
                console.error(`❌ Erro ao acessar ID ${id}:`, error);
            }
        }

        console.log("✅ Dados coletados:", alunos);
        criarETabelaExportar(alunos);
    }

    function criarETabelaExportar(alunos) {
        // Função para calcular as parciais
        function calcularParcial(quiz, tempo) {
            return (((quiz / 100) * 40 + (tempo / 15) * 10) / 50) * (25 / 4);
        }

        // Estrutura da planilha
        const planilha = [];
        planilha.push(["Aluno", "Quiz", "Tempo", "N1", "Quiz", "Tempo", "N2", "Quiz", "Tempo", "N3", "Quiz", "Tempo", "N4", "Total"]); // Cabeçalhos

        alunos.forEach((dados, aluno) => {
            const linha = [aluno]; // Começa com o nome do aluno
            let total = 0;

            dados.forEach((dado, index) => {
                linha.push(dado.quiz || 0); // Quiz
                linha.push(dado.tempo || 0); // Tempo
                const parcial = calcularParcial(dado.quiz || 0, dado.tempo || 0).toFixed(2);
                linha.push(parcial); // Nota parcial
                total += parseFloat(parcial);
            });

            // Preenche as colunas restantes, caso o aluno tenha menos de 4 quizzes
            while (linha.length < 13) {
                linha.push(0); // Preenche com 0
            }

            linha.push(total.toFixed(2)); // Adiciona o total
            planilha.push(linha); // Adiciona a linha à planilha
        });

        // Exporta para Excel
        exportarParaExcel(planilha);
    }

    function exportarParaExcel(planilha) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(planilha); // Converte os dados para a planilha
        XLSX.utils.book_append_sheet(wb, ws, "Desempenho");
        XLSX.writeFile(wb, "desempenho.xlsx");
        console.log("📁 Planilha exportada: desempenho.xlsx");
    }
})();
