(async function () {
    const ids = [659601, 659602, 659603, 659604]; // Lista de IDs para substituir em xxxxxx
    const baseUrl = "https://app.cgd.com.br/contratos/cursos-ead/xxxxxx/desempenho";

    for (const id of ids) {
        try {
            const url = baseUrl.replace("xxxxxx", id); // Substitui xxxxxx pelo ID atual
            console.log(`🌐 Acessando URL: ${url}`);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Adicione cabeçalhos de autenticação aqui, se necessário
                }
            });

            if (!response.ok) {
                console.error(`❌ Erro ao acessar o ID ${id}: Status ${response.status}`);
                continue;
            }

            const data = await response.text(); // Alterar para `response.json()` caso seja JSON
            console.log(`✅ Dados extraídos para ID ${id}:`, data);
        } catch (error) {
            console.error(`❌ Erro ao acessar o ID ${id}:`, error);
        }
    }

    console.log("🎉 Finalizado!");
})();
