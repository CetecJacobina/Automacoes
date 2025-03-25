const gabarito = "bccdaabdac".split('');


function marcarRadiosComGabarito(gabarito) {
    // Mapeamento das letras para os valores numéricos
    const mapeamento = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3
    };

    // Obter todos os botões de rádio na página
    const radios = document.querySelectorAll('input[type="radio"]');
    let i = 0;

    // Marcar os botões de rádio de acordo com o gabarito
    for (let j = 0; j < radios.length; j++) {
        // Calcular o índice do rádio a ser marcado
        const indiceRadio = (i * 4) + mapeamento[gabarito[i]];
        
        // Verificar se o índice é válido e marcar o rádio correspondente
        if (indiceRadio < radios.length) {
            radios[indiceRadio].checked = true;
            i++;
        }
    }

    // Após marcar todos os rádios, clicar nos botões
    clicarBotoes();
}

function clicarBotoes() {
    // Obter todos os botões com a classe 'salvar-pergunta'
    const botoes = document.querySelectorAll('.salvar-pergunta');
    
    // Clicar em cada um dos botões
    botoes.forEach(botao => {
        botao.click();
    });
}

// Exemplo de uso: marcar os botões de rádio com base no array de gabarito e clicar nos botões
marcarRadiosComGabarito(gabarito);