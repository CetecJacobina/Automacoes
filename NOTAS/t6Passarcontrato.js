(async function () {
    function adicionarBotaoNotas() {
        let btnPendencias = document.getElementById("btnPendencias");
        if (!btnPendencias) return;

        let btnNotas = document.createElement("button");
        btnNotas.textContent = "Notas";
        btnNotas.className = "btn btn-default btn-outline";
        btnNotas.style.marginLeft = "10px";
        btnNotas.onclick = abrirModal;
        
        btnPendencias.parentNode.insertBefore(btnNotas, btnPendencias.nextSibling);
    }

    function abrirModal() {
        let modal = document.createElement("div");
        modal.innerHTML = `
            <div style="position: fixed; top: 50px; left: 50%; transform: translateX(-50%); background: white; padding: 20px; border: 1px solid black; z-index: 1000; width: 300px;">
                <h3>Insira os alunos</h3>
                <textarea id="listaAlunos" rows="5" placeholder="Nome, Código\nNome, Código"></textarea>
                <h3>Selecione as lições</h3>
                <div id="checkboxLicoes"></div>
                <button id="btnComecar">Começar</button>
                <button onclick="this.parentNode.remove()">Fechar</button>
            </div>
        `;
        document.body.appendChild(modal);

        let checkboxContainer = document.getElementById("checkboxLicoes");
        ["Lição 1", "Lição 2", "Lição 3"].forEach((licao, index) => {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = index + 1;
            checkbox.checked = true;
            let label = document.createElement("label");
            label.textContent = licao;
            label.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            checkboxContainer.appendChild(document.createElement("br"));
        });

        document.getElementById("btnComecar").onclick = iniciarConsulta;
    }

    async function iniciarConsulta() {
        let alunos = document.getElementById("listaAlunos").value.trim().split("\n").map(l => l.split(","));
        let licoesSelecionadas = Array.from(document.querySelectorAll("#checkboxLicoes input:checked")).map(c => c.value);
        let dados = {};

        for (let [nome, codigo] of alunos) {
            nome = nome.trim();
            codigo = codigo.trim();
            dados[nome] = {};
            for (let licao of licoesSelecionadas) {
                let url = `https://app.cgd.com.br/contratos/cursos-ead/${codigo}/desempenho`;
                console.log(`Buscando ${nome} - Lição ${licao}...`);
                let resposta = await fetch(url);
                let html = await resposta.text();
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");
                dados[nome][`Lição ${licao}`] = extrairNotas(doc, licao);
            }
        }
        exportarParaExcel(dados);
    }

    function extrairNotas(doc, licao) {
        let notas = [];
        let linhas = doc.querySelectorAll("#dataTable tbody tr");
        for (let linha of linhas) {
            let colunas = linha.querySelectorAll("td");
            if (colunas.length < 4) continue;
            let titulo = colunas[0]?.textContent.trim();
            let nota = colunas[2]?.textContent.trim().replace(",", ".").replace("%", "");
            if (titulo.includes(`Lição ${licao}`)) {
                notas.push(parseFloat(nota) || 0);
            }
        }
        return notas;
    }

    function exportarParaExcel(dados) {
        let wb = XLSX.utils.book_new();
        for (let aluno in dados) {
            for (let licao in dados[aluno]) {
                let ws = XLSX.utils.aoa_to_sheet([["Aluno", "Nota"]]);
                dados[aluno][licao].forEach(nota => ws["A" + (ws.length + 1)] = nota);
                XLSX.utils.book_append_sheet(wb, ws, `${aluno} - ${licao}`);
            }
        }
        XLSX.writeFile(wb, "notas.xlsx");
    }

    adicionarBotaoNotas();
})();