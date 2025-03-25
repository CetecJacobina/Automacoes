// Função de Exportação
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

// Função de Importação
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

            let numeroDeQuestoesCriadas = document.querySelectorAll('textarea[name="pergunta"]').length;
            let questoesFaltando = quizData.questoes.length - numeroDeQuestoesCriadas;

            criarProximaQuestao(questoesFaltando, quizData);
        };

        reader.readAsText(file);
    });

    input.click();
}

function processarTxtParaQuiz(texto) {
    const linhas = texto.split("\n");
    let quiz = { titulo: "Teste seus conhecimentos!", tituloAbreviado: "Teste seus conhecimentos!", questoes: [] };
    let questaoAtual = null;

    linhas.forEach(linha => {
        linha = linha.trim();

        if (/^\d+\./.test(linha)) {
            if (questaoAtual) quiz.questoes.push(questaoAtual);
            questaoAtual = { pergunta: linha.replace(/^\d+\.\s*/, ""), respostas: [], correta: null };
        } else if (/^[A-D]\)/.test(linha)) {
            questaoAtual.respostas.push(linha.substring(3).trim());
        } else if (linha.startsWith("Resposta correta:")) {
            const respostaCorreta = linha.replace("Resposta correta:", "").trim();
            questaoAtual.correta = ["A", "B", "C", "D"].indexOf(respostaCorreta);
        }
    });

    if (questaoAtual) quiz.questoes.push(questaoAtual);

    return quiz;
}

async function criarProximaQuestao(questoesFaltando, quizData) {
    let nQuestaoAnterior = document.querySelectorAll('textarea[name="pergunta"]').length;

    while (questoesFaltando > 0) {
        document.querySelector("#criar-pergunta").click();

        let tentativas = 0;
        while (document.querySelectorAll('textarea[name="pergunta"]').length === nQuestaoAnterior) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500ms antes de verificar novamente
            tentativas++;

            if (tentativas > 10) {
                return;
            }
        }

        nQuestaoAnterior = document.querySelectorAll('textarea[name="pergunta"]').length;
        questoesFaltando--;
    }

    aguardarCriacaoQuestoes(quizData);
}

function aguardarCriacaoQuestoes(quizData) {
    let tentativas = 0;
    const maxTentativas = 20;
    
    const intervalo = setInterval(() => {
        const totalAtual = document.querySelectorAll('textarea[name="pergunta"]').length;
        if (totalAtual >= quizData.questoes.length || tentativas >= maxTentativas) {
            clearInterval(intervalo);
            setTimeout(() => preencherQuestoes(quizData), 1000);
        }
        tentativas++;
    }, 700);
}

function preencherQuestoes(quizData) {
    setTimeout(() => {
        const perguntas = document.querySelectorAll('textarea[name="pergunta"]');
        const respostas = document.querySelectorAll('textarea[name^="resposta"]');
        const radios = document.querySelectorAll('input[type="radio"]');

        quizData.questoes.forEach((questao, i) => {
            if (perguntas[i]) perguntas[i].value = questao.pergunta;
            questao.respostas.forEach((resposta, j) => {
                const respostaIndex = (i * 5) + j;
                if (respostas[respostaIndex]) respostas[respostaIndex].value = resposta;
            });
            if (questao.correta !== null) {
                const radioIndex = (i * 4) + questao.correta;
                if (radios[radioIndex]) radios[radioIndex].checked = true;
            }
        });

        setTimeout(() => {
            document.querySelectorAll(".salvar-pergunta").forEach(botao => botao.click());

            setTimeout(() => {
                const botaoSalvar = [...document.querySelectorAll("#btnSalvar")]
                    .find(btn => btn.textContent.trim() === "Salvar");

                if (botaoSalvar) botaoSalvar.click();

            }, 3000);

        }, 1000);
        
    }, 2000);
}

const titulos = document.querySelectorAll(".portlet-title");

titulos.forEach(titulo => {
    if (titulo.textContent.trim() === "Editar Quiz") {
        const containerBotoes = document.createElement("div");
        containerBotoes.style.display = "flex";
        containerBotoes.style.gap = "10px";
        containerBotoes.style.marginLeft = "auto";
        containerBotoes.style.justifyContent = "flex-end";

        const btnExportar = document.createElement("button");
        btnExportar.textContent = "Exportar Quiz";
        btnExportar.style.padding = "10px";
        btnExportar.addEventListener("click", exportarQuiz);
        containerBotoes.appendChild(btnExportar);

        const btnImportar = document.createElement("button");
        btnImportar.textContent = "Importar Quiz";
        btnImportar.style.padding = "10px";
        btnImportar.addEventListener("click", importarQuiz);
        containerBotoes.appendChild(btnImportar);

        titulo.appendChild(containerBotoes);
    }
});
