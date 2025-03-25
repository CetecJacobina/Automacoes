
///     CONSEGUIU EXPORTAR A LISTA FORNECIDA. Ja PEGA O NOME DO ALUNO.

(async function () {
    const ids = [659630, 659633, 659629];
    const baseUrl = "https://app.cgd.com.br/contratos/cursos-ead/xxxxxx/desempenho";

    if (!window.XLSX) {
        let script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = () => processarDados(ids);
        document.body.appendChild(script);
    } else {
        processarDados(ids);
    }

    async function processarDados(ids) {
        const alunos = new Map();

        for (const id of ids) {
            const url = baseUrl.replace("xxxxxx", id);
            console.log(`🌐 Acessando URL: ${url}`);

            try {
                const response = await fetch(url, { method: "GET" });
                if (!response.ok) continue;

                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");
               


                let nomeAluno = doc.querySelector("h3.page-title")?.textContent.trim() || `Aluno ${id}`;
                let linhas = doc.querySelectorAll("#dataTable tbody tr");

                let abaAtual = false;
                let countQuiz = 0;
                
                if (!alunos.has(nomeAluno)) alunos.set(nomeAluno, []);

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
                        countQuiz++;
                    }
                });
            } catch (error) {
                console.error(`❌ Erro ao acessar ID ${id}:`, error);
            }
        }

        console.log("✅ Dados coletados:", alunos);
        criarETabelaExportar(alunos);
    }

    function criarETabelaExportar(alunos) {
        function calcularParcial(quiz, tempo) {
            return (((quiz / 100) * 40 + (tempo / 15) * 10) / 50) * (25 / 4);
        }

        const planilha = [["Aluno", "Quiz", "Tempo", "N1", "Quiz", "Tempo", "N2", "Quiz", "Tempo", "N3", "Quiz", "Tempo", "N4", "Total"]];

        alunos.forEach((dados, aluno) => {
            const linha = [aluno];
            let total = 0;

            dados.forEach((dado) => {
                linha.push(dado.quiz || 0);
                linha.push(dado.tempo || 0);
                const parcial = calcularParcial(dado.quiz || 0, dado.tempo || 0).toFixed(2);
                linha.push(parcial);
                total += parseFloat(parcial);
            });

            while (linha.length < 13) linha.push(0);
            linha.push(total.toFixed(2));
            planilha.push(linha);
        });

        exportarParaExcel(planilha);
    }

    function exportarParaExcel(planilha) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(planilha);
        XLSX.utils.book_append_sheet(wb, ws, "Desempenho");
        XLSX.writeFile(wb, "desempenho_simplificado.xlsx");
        console.log("📁 Planilha exportada: desempenho_simplificado.xlsx");
    }
})();
