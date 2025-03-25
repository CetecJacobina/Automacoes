// OBTEM O NUMERO DE QUESTÕES=========================================================

// Seleciona todas as perguntas pelo textarea com nome "pergunta"

//const perguntas = document.querySelectorAll('textarea[name="pergunta"]');

// Conta o número de perguntas
const numeroDePerguntas = perguntas.length;

// Imprime o número de perguntas no console
console.log(`Número de perguntas: ${numeroDePerguntas}`);


// OBTEM O CONTEUDO DAS QUESTÕES=========================================================


// Seleciona todos os elementos textarea com o nome "pergunta"
const perguntas = document.querySelectorAll('textarea[name="pergunta"]');

// Itera sobre cada textarea encontrado e imprime seu conteúdo
perguntas.forEach((pergunta, index) => {
  console.log(`Pergunta ${index + 1}:`, pergunta.value);
});

// OBTEM O CONTEUDO DAS RESPOSTAS=========================================================


// Seleciona todos os elementos textarea cujo nome começa com "resposta"
const respostas = document.querySelectorAll('textarea[name^="resposta"]');

// Itera sobre cada textarea encontrado e imprime seu conteúdo
respostas.forEach((resposta, index) => {
  console.log(`Conteúdo da resposta ${index + 1}:`, resposta.value);
});
