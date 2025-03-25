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

// Executar no console para testar:
obterLicoesSelecionadas();
