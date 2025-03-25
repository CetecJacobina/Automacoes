(async function () {
    // Carrega a biblioteca XLSX dinamicamente
    if (!window.XLSX) {
        let script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = exportarParaExcel;
        document.body.appendChild(script);
    } else {
        exportarParaExcel();
    }

    function exportarParaExcel() {
        let alunos = [];
        let licao = document.querySelector("#dataTable tbody tr td strong")?.textContent.trim() || "Qualidade de vida";

        // Captura o nome do aluno
        let alunoNome = document.querySelector("h3.page-title")?.textContent.trim();
        
        if (!alunoNome) {
            console.warn("Nome do aluno não encontrado!");
            return;
        }

        // Seleciona todas as linhas da tabela
        let linhas = document.querySelectorAll("#dataTable tbody tr");
        
        let tempos = [];
        let quizzes = [];

        // Percorre as linhas para capturar tempos e quizzes corretamente
        linhas.forEach((linha) => {
            let colunas = linha.querySelectorAll("td");
            if (colunas.length < 4) return;

            let titulo = colunas[0]?.textContent.trim();
            let nota = colunas[2]?.textContent.trim().replace(",", ".").replace("%", "");
            let tempo = colunas[3]?.textContent.trim();

            if (titulo.startsWith("Teste seus conhecimentos!")) return;

            if (tempo) {
                let partes = tempo.split(":").map(Number);
                let minutos = partes[0] * 60 + partes[1]; // Converte para minutos
                tempos.push(minutos);
            }

            if (!isNaN(parseFloat(nota))) {
                quizzes.push(parseFloat(nota));
            }
        });

        // Monta a estrutura dos dados
        let linhaDados = [alunoNome];
        for (let i = 0; i < 4; i++) {
            linhaDados.push(tempos[i] || 0);
            linhaDados.push(quizzes[i] || 0);
            linhaDados.push(""); // Parcial
        }

        // Fórmulas para "Parc 1, 2, 3 e 4" e "Média"
        let formulas = [];
        for (let i = 1; i <= 4; i++) {
            formulas.push(`=((B${i+1}/100)*40+(C${i+1}/15)*10)/50*(25/4)`);
        }
        let mediaFormula = `=SOMA(D2+G2+J2+M2)`;

        // Junta os dados e fórmulas
        linhaDados = [...linhaDados.slice(0, 3), formulas[0], ...linhaDados.slice(4, 6), formulas[1], ...linhaDados.slice(7, 9), formulas[2], ...linhaDados.slice(10, 12), formulas[3], mediaFormula];

        alunos.push(linhaDados);

        // Criando a planilha
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([
            ["Aluno", "Tempo 1", "Quiz 1", "Parc 1", "Tempo 2", "Quiz 2", "Parc 2", "Tempo 3", "Quiz 3", "Parc 3", "Tempo 4", "Quiz 4", "Parc 4", "Média"],
            ...alunos
        ]);

        XLSX.utils.book_append_sheet(wb, ws, "Resultados");

        // Exportando o arquivo
        let nomeArquivo = `${licao.replace(/[/\\?%*:|"<>]/g, "")}.xlsx`; // Remove caracteres inválidos no nome do arquivo
        XLSX.writeFile(wb, nomeArquivo);
        console.log("Arquivo exportado:", nomeArquivo);
    }
})();
