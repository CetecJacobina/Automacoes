// Identifica as disicplinas

// Seleciona a tabela contida no seletor
const tabela = document.querySelector("#dataTable_wrapper > div.table-scrollable");

// Verifica se a tabela foi encontrada
if (tabela) {
    // Seleciona todas as linhas da tabela
    const linhas = tabela.querySelectorAll("tbody tr");

    // Percorre as linhas e extrai somente os títulos
    linhas.forEach((linha, index) => {
        // Seleciona a primeira célula da linha (ajuste conforme necessário)
        const tituloColuna = linha.querySelector("td:nth-child(1) > strong");

        // Verifica se a célula foi encontrada
        if (tituloColuna) {
            const titulo = tituloColuna.textContent.trim(); // Captura o texto da célula e remove espaços extras
            console.log(`Disciplina:`, titulo);
        } 
    });
} else {
    console.error("❌ Tabela não encontrada no seletor informado. Verifique o seletor.");
}
