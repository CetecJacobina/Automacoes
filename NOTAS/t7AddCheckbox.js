(async function () {
    if (!window.XLSX) {
        let script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = exportarParaExcel;
        document.body.appendChild(script);
    } else {
        exportarParaExcel();
    }

    function exportarParaExcel() {
        let quizzes = [];
        let tempos = [];
        let linhas = document.querySelectorAll("#dataTable tbody tr");

        console.log("🔍 Extraindo dados da tabela...");

        let abaAtual = false; // Marca se estamos na aba "1. Qualidade de Vida"
        linhas.forEach((linha, index) => {
            let colunas = linha.querySelectorAll("td");
            if (colunas.length < 4) return;

            let titulo = colunas[0]?.textContent.trim();
            let nota = colunas[2]?.textContent.trim().replace(",", ".").replace("%", "");
            let tempo = colunas[3]?.textContent.trim();

            console.log(`📌 Linha ${index + 1}:`, { titulo, nota, tempo });

            // Adiciona checkbox se o título começar com "n."
            if (/^\d+\./.test(titulo)) {
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.style.marginRight = "5px";

                // Adiciona o checkbox no início da célula
                colunas[0].innerHTML = ""; // Limpa a célula
                colunas[0].appendChild(checkbox); // Insere o checkbox
                colunas[0].appendChild(document.createTextNode(titulo)); // Reinsere o texto
                console.log(`✅ Checkbox adicionado na célula: "[ ] ${titulo}"`);
            }

            // Detecta a aba pela linha "n."
            if (/^\d+\./.test(titulo)) {
                abaAtual = titulo.startsWith("1."); // Trabalhamos apenas com a aba "1. Qualidade de Vida"
                return;
            }

            if (!abaAtual) return; // Ignora linhas fora da aba

            // Captura os tempos e restringe a 15 minutos
            if (tempo && !/teste/i.test(titulo)) {
                let partes = tempo.split(":").map(Number);
                let minutos = partes[0] * 60 + partes[1];
                minutos = Math.min(minutos, 15); // Limita a 15 minutos
                tempos.push(minutos);
            }

            // Captura as notas dos quizzes (linhas que contenham "teste")
            if (/teste/i.test(titulo)) {
                let matchNota = nota.match(/\d+(\.\d+)?/);
                if (matchNota) {
                    quizzes.push(parseFloat(matchNota[0]));
                } else {
                    quizzes.push(0);
                }
            }
        });

        // Garante que os arrays tenham no máximo 4 elementos
        quizzes = quizzes.slice(0, 4);
        tempos = tempos.slice(0, 4);

        console.log("✅ Quizzes coletados:", quizzes);
        console.log("✅ Tempos coletados (máx 15 min):", tempos);
    }
})();
