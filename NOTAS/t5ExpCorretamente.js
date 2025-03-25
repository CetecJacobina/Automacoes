(async function () {
    if (!window.XLSX) {
        let script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = processarDados;
        document.body.appendChild(script);
    } else {
        processarDados();
    }

    function processarDados() {
        let alunos = new Map(); // Usaremos um Map para associar os dados aos alunos
        let linhas = document.querySelectorAll("#dataTable tbody tr");

        console.log("🔍 Extraindo dados da tabela...");

        let abaAtual = false; // Marca se estamos na aba "1. Qualidade de Vida"
        let nomeAluno = "Miriam Sousa Da Silva"; // Nome do aluno a ser atribuído
        let countQuiz = 0;

        linhas.forEach((linha, index) => {
            let colunas = linha.querySelectorAll("td");
            if (colunas.length < 4) return;

            let titulo = colunas[0]?.textContent.trim();
            let nota = colunas[2]?.textContent.trim().replace(",", ".").replace("%", "");
            let tempo = colunas[3]?.textContent.trim();

            console.log(`📌 Linha ${index + 1}:`, { titulo, nota, tempo });

            // Detecta a aba pela linha "n."
            if (/^\d+\./.test(titulo)) {
                abaAtual = titulo.startsWith("1."); // Trabalhamos apenas com a aba "1. Qualidade de Vida"
                return;
            }

            if (!abaAtual) return; // Ignora linhas fora da aba

            if (!alunos.has(nomeAluno)) {
                alunos.set(nomeAluno, []);
            }

            // Captura os tempos e restringe a 15 minutos
            if (tempo && !/teste/i.test(titulo)) {
                let partes = tempo.split(":").map(Number);
                let minutos = partes[0] * 60 + partes[1];
                minutos = Math.min(minutos, 15); // Limita a 15 minutos
                alunos.get(nomeAluno).push({ tempo: minutos, quiz: null });
            }

            // Captura as notas dos quizzes (linhas que contenham "teste")
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

        console.log("✅ Alunos e dados coletados:", alunos);

        // Cria a tabela e exporta
        criarETabelaExportar(alunos);
    }

    function criarETabelaExportar(alunos) {
        // Função para calcular as parciais
        function calcularParcial(quiz, tempo) {
            return (((quiz / 100) * 40 + (tempo / 15) * 10) / 50) * (25 / 4);
        }

        // Criando a tabela dinamicamente
        const tabela = document.createElement("table");
        tabela.border = "1";
        tabela.style.borderCollapse = "collapse";
        tabela.style.margin = "20px 0";
        tabela.style.width = "100%";
        tabela.style.textAlign = "center";

        // Cabeçalho da tabela
        const thead = tabela.createTHead();
        const rowHead = thead.insertRow();

        ["Aluno", "Quiz", "Tempo", "N1", "Quiz", "Tempo", "N2", "Quiz", "Tempo", "N3", "Quiz", "Tempo", "N4", "25"].forEach((header) => {
            const cell = document.createElement("th");
            cell.textContent = header;
            cell.style.border = "1px solid black";
            cell.style.padding = "8px";
            rowHead.appendChild(cell);
        });

        // Corpo da tabela
        const tbody = tabela.createTBody();

        alunos.forEach((dados, aluno) => {
            const row = tbody.insertRow();

            // Nome do aluno
            const cellAluno = row.insertCell();
            cellAluno.textContent = aluno;
            cellAluno.style.border = "1px solid black";
            cellAluno.style.padding = "8px";

            let total = 0;

            dados.forEach((dado, index) => {
                // Quiz
                const cellQuiz = row.insertCell();
                cellQuiz.textContent = dado.quiz || 0;
                cellQuiz.style.border = "1px solid black";
                cellQuiz.style.padding = "8px";

                // Tempo
                const cellTempo = row.insertCell();
                cellTempo.textContent = dado.tempo || 0;
                cellTempo.style.border = "1px solid black";
                cellTempo.style.padding = "8px";

                // Nota (Parcial)
                const cellNota = row.insertCell();
                const nota = calcularParcial(dado.quiz || 0, dado.tempo || 0).toFixed(2);
                cellNota.textContent = nota;
                total += parseFloat(nota);
                cellNota.style.border = "1px solid black";
                cellNota.style.padding = "8px";
            });

            // Total
            const cellTotal = row.insertCell();
            cellTotal.textContent = total.toFixed(2);
            cellTotal.style.border = "1px solid black";
            cellTotal.style.padding = "8px";
        });

        // Adiciona a tabela ao documento
        document.body.appendChild(tabela);

        // Botão para exportar para Excel
        const button = document.createElement("button");
        button.textContent = "Exportar para Excel";
        button.style.marginTop = "20px";
        button.onclick = () => exportarParaExcel(tabela);
        document.body.appendChild(button);
    }

    function exportarParaExcel(tabela) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(tabela);
        XLSX.utils.book_append_sheet(wb, ws, "Notas");
        XLSX.writeFile(wb, "notas.xlsx");
    }
})();
