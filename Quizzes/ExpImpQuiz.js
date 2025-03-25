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

// Função de Importação atualizada
function importarQuiz() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json, .txt"; // Agora permite JSON e TXT

    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            const fileType = file.name.split('.').pop().toLowerCase();

            let quizData;

            if (fileType === "json") {
                quizData = JSON.parse(fileContent);
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

            // Preencher os títulos
            document.querySelector('input[name="titulo"]').value = quizData.titulo || "Novo Quiz";
            document.querySelector('input[name="titulo_abreviado"]').value = quizData.tituloAbreviado || "novo_quiz";

            // Criar e preencher as questões
            let numeroDeQuestoesCriadas = document.querySelectorAll('textarea[name="pergunta"]').length;
            const questoesFaltando = quizData.questoes.length - numeroDeQuestoesCriadas;

            function criarProximaQuestao(questoesFaltando) {
                if (faltando > 0) {
                    document.querySelector("#criar-pergunta").click();
                    setTimeout(() => {
                        criarProximaQuestao(faltando - 1);
                    }, 700);
                } else {
                    setTimeout(() => {
                        preencherQuestoes(quizData);
                    }, 1000);
                }
            }

            criarProximaQuestao(questoesFaltando);
        };

        reader.readAsText(file);
    });

    input.click();
}

// Função para processar arquivo .txt e converter para JSON
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

// Função para aguardar a criação de todas as questões antes de preencher os dados
function aguardarCriacaoQuestoes(callback) {
    let tentativas = 0;
    const maxTentativas = 20;

    const intervalo = setInterval(() => {
        const totalAtual = document.querySelectorAll('textarea[name="pergunta"]').length;
        console.log(`Tentativa ${tentativas + 1}: Criadas ${totalAtual} questões`);

        if (totalAtual >= document.querySelectorAll('textarea[name="pergunta"]').length || tentativas >= maxTentativas) {
            clearInterval(intervalo);
            callback();
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

        // Aguarda um tempo para garantir que os campos foram preenchidos antes de salvar
        setTimeout(() => {
            // Clica em todos os botões de salvar questões individuais
            document.querySelectorAll(".salvar-pergunta").forEach(botao => botao.click());

            // Aguarda mais tempo para garantir que todas as questões foram salvas antes de clicar no botão principal
            setTimeout(() => {
                const botaoSalvar = [...document.querySelectorAll("#btnSalvar")]
                    .find(btn => btn.textContent.trim() === "Salvar");

                if (botaoSalvar) botaoSalvar.click();

            }, 3000); // Ajuste esse tempo conforme necessário para garantir que todas as questões tenham sido salvas

        }, 1000); // Tempo para salvar as questões individuais

    }, 2000); // Tempo extra para garantir que os campos foram criados antes do preenchimento
}


// Criar os botões APÓS a definição das funções
const titulos = document.querySelectorAll(".portlet-title");

titulos.forEach(titulo => {
    if (titulo.textContent.trim() === "Editar Quiz") {
        // Criar um container para os botões
        const containerBotoes = document.createElement("div");
        containerBotoes.style.display = "flex";
        containerBotoes.style.gap = "10px"; // Espaçamento entre os botões
        containerBotoes.style.marginLeft = "auto"; // Alinha à direita
        containerBotoes.style.justifyContent = "flex-end";

        // Criar botão de Exportação
        const btnExportar = document.createElement("button");
        btnExportar.textContent = "Exportar Quiz";
        btnExportar.style.padding = "10px";
        btnExportar.addEventListener("click", exportarQuiz);
        containerBotoes.appendChild(btnExportar);

        // Criar botão de Importação
        const btnImportar = document.createElement("button");
        btnImportar.textContent = "Importar Quiz";
        btnImportar.style.padding = "10px";
        btnImportar.addEventListener("click", importarQuiz);
        containerBotoes.appendChild(btnImportar);

        // Adicionar o container de botões à div do título
        titulo.appendChild(containerBotoes);
    }
});