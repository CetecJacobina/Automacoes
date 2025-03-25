////////////////////////////////////
// EXPORTOU, MAS NÃO PREENCHEU O CONTEUDO.
////////////////////////////////////
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// Função de Exportação de Lição
function exportarLicao() {
    const licaoData = {
        titulo: document.querySelector('input[name="titulo"]').value,
        tituloAbreviado: document.querySelector('input[name="titulo_abreviado"]').value,
        conteudo: document.querySelector('textarea#summernote').value
    };

    const blob = new Blob([JSON.stringify(licaoData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${licaoData.tituloAbreviado || 'licao'}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Função de Importação de Lição
function importarLicao() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const licaoData = JSON.parse(e.target.result);
                document.querySelector('input[name="titulo"]').value = licaoData.titulo || "Nova Lição";
                document.querySelector('input[name="titulo_abreviado"]').value = licaoData.tituloAbreviado || "nova_licao";
                document.querySelector('textarea#summernote').value = licaoData.conteudo || "";
            } catch (error) {
                alert("Erro ao processar JSON!");
            }
        };
        reader.readAsText(file);
    });

    input.click();
}

// Adicionando os botões na seção "Editar Conteúdo"
const portletTitles = document.querySelectorAll(".portlet-title");

portletTitles.forEach(portlet => {
    const caption = portlet.querySelector(".caption");
    if (caption && caption.textContent.trim() === "Editar Conteúdo") {
        const containerBotoes = document.createElement("div");
        containerBotoes.style.display = "flex";
        containerBotoes.style.gap = "10px";
        containerBotoes.style.marginLeft = "auto";
        containerBotoes.style.justifyContent = "flex-end";

        // Botão Exportar Lição
        const btnExportarLicao = document.createElement("button");
        btnExportarLicao.textContent = "Exportar Lição";
        btnExportarLicao.style.padding = "10px";
        btnExportarLicao.addEventListener("click", exportarLicao);
        containerBotoes.appendChild(btnExportarLicao);

        // Botão Importar Lição
        const btnImportarLicao = document.createElement("button");
        btnImportarLicao.textContent = "Importar Lição";
        btnImportarLicao.style.padding = "10px";
        btnImportarLicao.addEventListener("click", importarLicao);
        containerBotoes.appendChild(btnImportarLicao);

        // Adiciona os botões no "portlet-title"
        portlet.appendChild(containerBotoes);
    }
});





// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
////////////////////////////////////
// EXPORTOU, MAS NÃO PREENCHEU O CONTEUDO.
////////////////////////////////////



////////////////////////////////////
///
////////////////////////////////////


// Função de Exportação de Lição
function exportarLicao() {
    const licaoData = {
        titulo: document.querySelector('input[name="titulo"]').value,
        tituloAbreviado: document.querySelector('input[name="titulo_abreviado"]').value,
        conteudo: document.querySelector('textarea#summernote').value
    };

    const blob = new Blob([JSON.stringify(licaoData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${licaoData.tituloAbreviado || 'licao'}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Função de Importação de Lição (nova abordagem)
function importarLicao() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Nenhum arquivo foi selecionado.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const licaoData = JSON.parse(e.target.result);

                // Verifica e preenche o título
                if (licaoData.titulo) {
                    document.querySelector('input[name="titulo"]').value = licaoData.titulo;
                } else {
                    console.warn("Título ausente no arquivo.");
                }

                // Verifica e preenche o título abreviado
                if (licaoData.tituloAbreviado) {
                    document.querySelector('input[name="titulo_abreviado"]').value = licaoData.tituloAbreviado;
                } else {
                    console.warn("Título abreviado ausente no arquivo.");
                }

                // Verifica e preenche o conteúdo usando o método do editor (Summernote, por exemplo)
                if (licaoData.conteudo) {
                    if (typeof $('#summernote').summernote === 'function') {
                        $('#summernote').summernote('code', licaoData.conteudo); // Método Summernote
                    } else {
                        document.querySelector('textarea#summernote').value = licaoData.conteudo;
                    }
                } else {
                    console.warn("Conteúdo ausente no arquivo.");
                }
            } catch (error) {
                console.error("Erro ao processar o arquivo JSON:", error);
                alert("Erro ao processar o arquivo JSON. Verifique o formato do arquivo.");
            }
        };
        reader.readAsText(file);
    });

    input.click();
}


// Adicionando os botões na seção "Editar Conteúdo"
const portletTitles = document.querySelectorAll(".portlet-title");

portletTitles.forEach(portlet => {
    const caption = portlet.querySelector(".caption");
    if (caption && caption.textContent.trim() === "Editar Conteúdo") {
        const containerBotoes = document.createElement("div");
        containerBotoes.style.display = "flex";
        containerBotoes.style.gap = "10px";
        containerBotoes.style.marginLeft = "auto";
        containerBotoes.style.justifyContent = "flex-end";

        // Botão Exportar Lição
        const btnExportarLicao = document.createElement("button");
        btnExportarLicao.textContent = "Exportar Lição";
        btnExportarLicao.style.padding = "10px";
        btnExportarLicao.addEventListener("click", exportarLicao);
        containerBotoes.appendChild(btnExportarLicao);

        // Botão Importar Lição
        const btnImportarLicao = document.createElement("button");
        btnImportarLicao.textContent = "Importar Lição";
        btnImportarLicao.style.padding = "10px";
        btnImportarLicao.addEventListener("click", importarLicao);
        containerBotoes.appendChild(btnImportarLicao);

        // Adiciona os botões no "portlet-title"
        portlet.appendChild(containerBotoes);
    }
});


