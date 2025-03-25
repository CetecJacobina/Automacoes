// Função de Exportação do Quiz
function exportarQuiz() {
    const quizData = {
        titulo: document.querySelector('input[name="titulo"]').value,
        tituloAbreviado: document.querySelector('input[name="titulo_abreviado"]').value,
        numeroQuestoes: document.querySelectorAll('textarea[name="pergunta"]').length,
        questoes: []
    };

    const perguntas = document.querySelectorAll('textarea[name="pergunta"]');
    const respostas = document.querySelectorAll('textarea[name^="resposta"]');
    const radios = document.querySelectorAll('input[type="radio"]');

    perguntas.forEach((pergunta, i) => {
        const questao = {
            pergunta: pergunta.value,
            respostas: [],
            correta: null
        };

        for (let j = 0; j < 5; j++) {
            const respostaIndex = (i * 5) + j;
            if (respostas[respostaIndex]) {
                questao.respostas.push(respostas[respostaIndex].value);
            }
        }

        for (let j = 0; j < 4; j++) {
            const radioIndex = (i * 4) + j;
            if (radios[radioIndex] && radios[radioIndex].checked) {
                questao.correta = j;
            }
        }

        quizData.questoes.push(questao);
    });

    const blob = new Blob([JSON.stringify(quizData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizData.tituloAbreviado}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Função de Importação do Quiz
function importarQuiz() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json, .txt";

    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            const fileType = file.name.split('.').pop().toLowerCase();

            let quizData;
            if (fileType === "json") {
                try {
                    quizData = JSON.parse(fileContent);
                } catch (error) {
                    alert("Erro ao processar JSON!");
                    return;
                }
            } else if (fileType === "txt") {
                quizData = processarTxtParaQuiz(fileContent);
            } else {
                alert("Formato de arquivo não suportado!");
                return;
            }

            if (!quizData || !quizData.questoes) {
                alert("Erro ao processar o arquivo.");
                return;
            }

            document.querySelector('input[name="titulo"]').value = quizData.titulo || "Novo Quiz";
            document.querySelector('input[name="titulo_abreviado"]').value = quizData.tituloAbreviado || "novo_quiz";
            criarProximaQuestao(quizData.questoes.length, quizData);
        };

        reader.readAsText(file);
    });

    input.click();
}

// Função para Exportar Lição
function criarBotaoExportar() {
    const containerBotoes = document.querySelector('.form-body');

    if (containerBotoes) {
        const btnExportar = document.createElement("button");
        btnExportar.textContent = "Exportar Lição";
        btnExportar.style.padding = "10px";
        btnExportar.style.marginLeft = "10px";
        btnExportar.style.float = "right";

        btnExportar.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            exportarLicoes();
        });

        const btnAtualizar = containerBotoes.querySelector('button#btnAtualizar');
        if (btnAtualizar) {
            btnAtualizar.insertAdjacentElement('afterend', btnExportar);
        } else {
            console.log('⚠️ Botão "Atualizar" não encontrado');
        }
    } else {
        console.log('⚠️ Container com a classe "form-body" não encontrado');
    }
}

// Função para Adicionar Checkboxes nas Lições
function adicionarCheckboxLicoes() {
    const licoes = document.querySelectorAll("#shared-lists > .list-group-item.bg-grey");

    if (licoes.length === 0) {
        console.log("⚠️ Nenhuma lição encontrada.");
        return;
    }

    licoes.forEach(licao => {
        if (!licao.querySelector(".checkbox-licao")) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox-licao");
            checkbox.style.marginRight = "10px";
            licao.prepend(checkbox);
        }
    });

    console.log("✅ Checkboxes adicionados!");
}

// Função para Obter Lições Selecionadas
function obterLicoesSelecionadas() {
    const checkboxes = document.querySelectorAll(".checkbox-licao:checked");
    const licoesSelecionadas = [];

    checkboxes.forEach(checkbox => {
        const licao = checkbox.parentElement;
        const titulo = licao.innerText.trim().split("\n")[0];
        let proximoElemento = licao.nextElementSibling;

        if (proximoElemento && proximoElemento.classList.contains("lista")) {
            const itens = proximoElemento.querySelectorAll(".list-group-item");
            let itensLicao = [];

            itens.forEach(item => {
                const linkEditar = item.querySelector('a[href*="edit"]')?.href;
                const tipo = item.innerText.includes("Quiz") ? "Quiz" : "Conteúdo";

                if (linkEditar) {
                    itensLicao.push({ tipo, link: linkEditar });
                }
            });

            licoesSelecionadas.push({ titulo, itens: itensLicao });
        }
    });

    console.log("📚 Lições selecionadas:", licoesSelecionadas);
    return licoesSelecionadas;
}
