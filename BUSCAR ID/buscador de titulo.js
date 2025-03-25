// consegue acessar a pagina pelo link

(async function () {
    const url = "https://app.cgd.com.br/contratos/cursos-ead/530077";

    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // Inclui cookies da sessão
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (response.ok) {
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            // Captura o título da página
            const title = doc.querySelector("title")?.textContent.trim();
            console.log(`📋 Título da página: ${title}`);
        } else {
            console.error(`❌ Erro ao acessar a página: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`⚠️ Erro ao realizar a requisição: ${error.message}`);
    }
})();





////////////////////////////////////////////////////
///////////////////////////////////////////////////
////      pega todos os elementos da pagina

(async function () {
    const url = "https://app.cgd.com.br/contratos/cursos-ead/530077";

    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // Inclui cookies da sessão
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (response.ok) {
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            // Captura o título da página
            const title = doc.querySelector("title")?.textContent.trim();
            console.log(`📋 Título da página: ${title}`);
            
            // Iterar por todos os elementos da página
            const elementos = doc.querySelectorAll("*");
            console.log(`🌐 Total de elementos encontrados: ${elementos.length}`);
            
            elementos.forEach((elemento, index) => {
                console.log(`🔸 Elemento ${index + 1}: <${elemento.tagName.toLowerCase()}>`);
                console.log(`   → Conteúdo: ${elemento.textContent.trim()}`);
                console.log(`   → Atributos:`, elemento.attributes);
            });
        } else {
            console.error(`❌ Erro ao acessar a página: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`⚠️ Erro ao realizar a requisição: ${error.message}`);
    }
})();






////////////////////////////////////////////////////
///////////////////////////////////////////////////
////      Consegue ver os dados da tabela





(async function () {
    const url = "https://app.cgd.com.br/contratos/cursos-ead/530077/andamento"; // Endpoint identificado

    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // Inclui cookies para autenticação
            headers: {
                'Accept': 'text/html', // Aceita HTML
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (response.ok) {
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            console.log("📋 HTML carregado com sucesso!");

            // Exibe o HTML completo no console para análise
            console.log("📋 HTML recebido:\n", html);

            // Selecionar linhas da tabela diretamente no HTML retornado
            const linhasTabela = doc.querySelectorAll("#cursos_andamento > div.table-scrollable > table > tbody > tr");
            if (linhasTabela.length > 0) {
                console.log(`✅ ${linhasTabela.length} linhas encontradas na tabela.`);
                linhasTabela.forEach((linha, index) => {
                    const curso = linha.querySelector("td:nth-child(1)")?.textContent.trim() || "N/A";
                    const tipo = linha.querySelector("td:nth-child(2)")?.textContent.trim() || "N/A";
                    const inicio = linha.querySelector("td:nth-child(3)")?.textContent.trim() || "N/A";
                    const expiracao = linha.querySelector("td:nth-child(4)")?.textContent.trim() || "N/A";
                    const email = linha.querySelector("td:nth-child(5)")?.textContent.trim() || "N/A";

                    console.log(`🔹 Linha ${index + 1}:`);
                    console.log(`   Curso: ${curso}`);
                    console.log(`   Tipo: ${tipo}`);
                    console.log(`   Início: ${inicio}`);
                    console.log(`   Expiração: ${expiracao}`);
                    console.log(`   E-mail: ${email}`);
                });
            } else {
                console.warn("⚠️ Nenhuma linha encontrada na tabela.");
            }
        } else {
            console.error(`❌ Erro ao acessar os dados: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`⚠️ Erro ao realizar a requisição: ${error.message}`);
    }
})();








////////////////////////////////
///////////////////////////////
/// CONSEGUE ACESSAR OS DADOS DOS ALUNOS E O ID

(async function () {
    const url = "https://app.cgd.com.br/contratos/cursos-ead/530077/andamento";

    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // Inclui cookies para autenticação
            headers: {
                'Accept': 'text/html', // Aceita HTML
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (response.ok) {
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            console.log("📋 HTML carregado com sucesso!");

            // Seleciona a tabela de cursos em andamento
            const tabela = doc.querySelector(".table-scrollable > table");
            if (tabela) {
                console.log("✅ Tabela encontrada!");

                // Seleciona as linhas da tabela
                const linhas = tabela.querySelectorAll("tbody > tr");
                if (linhas.length > 0) {
                    console.log(`✅ ${linhas.length} linhas encontradas na tabela.`);
                    linhas.forEach((linha, index) => {
                        const curso = linha.querySelector("td:nth-child(1)")?.textContent.trim() || "N/A";
                        const linkDesempenho = linha.querySelector("td:nth-child(6) > div > a[href*='/desempenho']")?.href;

                        console.log(`🔹 Linha ${index + 1}:`);
                        console.log(`   Curso: ${curso}`);
                        if (linkDesempenho) {
                            console.log(`   Link de Desempenho: ${linkDesempenho}`);
                        } else {
                            console.log("   ⚠️ Link de Desempenho não encontrado.");
                        }
                    });
                } else {
                    console.warn("⚠️ Nenhuma linha encontrada na tabela.");
                }
            } else {
                console.warn("⚠️ Tabela não encontrada no HTML.");
            }
        } else {
            console.error(`❌ Erro ao acessar os dados: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(`⚠️ Erro ao realizar a requisição: ${error.message}`);
    }
})();



////////////////////////////////////////////////////////////////////////////
///
//   CONSEGUE PEGAR O NOME E ID DOS ALUNOS
//

var script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
document.head.appendChild(script);



(async function () {
    // Adiciona um input para carregar o arquivo
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", async function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (rows.length < 2) {
                console.error("⚠️ Planilha inválida. Deve conter pelo menos um curso e um aluno.");
                return;
            }

            const nomeCurso = rows[0][0] || "Curso Desconhecido";
            const alunos = rows.slice(1).map(row => row[0]).filter(Boolean);
            const resultados = [["Aluno", "ID do Contrato", "Link do Contrato"]];

            console.log(`📚 Curso: ${nomeCurso}`);
            console.log("🔍 Buscando contratos para os alunos...");

            for (const aluno of alunos) {
                const contratoID = Math.floor(500000 + Math.random() * 100000); // Simulação de ID
                const linkContrato = `https://app.cgd.com.br/contratos/cursos-ead/${contratoID}`;
                console.log(`✅ Aluno: ${aluno} | ID: ${contratoID}`);
                resultados.push([aluno, contratoID, linkContrato]);
            }

            // Criar um novo arquivo XLSX
            const newSheet = XLSX.utils.aoa_to_sheet(resultados);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Contratos");
            const newExcel = XLSX.write(newWorkbook, { bookType: "xlsx", type: "array" });

            // Criar um Blob e baixar o arquivo
            const blob = new Blob([newExcel], { type: "application/octet-stream" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "contratos.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    });

    // Simula um clique no input para selecionar o arquivo
    input.click();
})();



///////////////////////////////////////////////////////////
//
// CONSEGUIU PEGAR O ID DOS ALUNOS

var script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
document.head.appendChild(script);

(async function () {
    // Adiciona um input para carregar o arquivo Excel
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", async function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (rows.length < 2) {
                console.error("⚠️ Planilha inválida. Deve conter pelo menos um curso e um aluno.");
                return;
            }

            const nomeCurso = rows[0][0] || "Curso Desconhecido";
            const alunos = rows.slice(1).map(row => row[0]).filter(Boolean);
            const resultados = [["aluno", "id"]]; // Define os cabeçalhos da planilha

            console.log(`📚 Curso: ${nomeCurso}`);
            console.log("🔍 Buscando contratos e desempenho para os alunos...");

            for (const aluno of alunos) {
                try {
                    const searchUrl = `https://app.cgd.com.br/cursos-ead/alunos?q=${encodeURIComponent(aluno)}`;
                    console.log(`🌐 Buscando aluno: ${aluno} em ${searchUrl}`);

                    const searchResponse = await fetch(searchUrl, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'text/html',
                            'User-Agent': 'Mozilla/5.0'
                        }
                    });

                    if (searchResponse.ok) {
                        const searchHtml = await searchResponse.text();
                        const searchDoc = new DOMParser().parseFromString(searchHtml, "text/html");

                        const contratoLink = searchDoc.querySelector("a[href*='/contratos/cursos-ead/']")?.href;
                        if (contratoLink) {
                            console.log(`✅ Contrato encontrado para ${aluno}: ${contratoLink}`);

                            const andamentoUrl = `${contratoLink}/andamento`;
                            const andamentoResponse = await fetch(andamentoUrl, {
                                method: 'GET',
                                credentials: 'include',
                                headers: {
                                    'Accept': 'text/html',
                                    'User-Agent': 'Mozilla/5.0'
                                }
                            });

                            if (andamentoResponse.ok) {
                                const andamentoHtml = await andamentoResponse.text();
                                const andamentoDoc = new DOMParser().parseFromString(andamentoHtml, "text/html");

                                const tabela = andamentoDoc.querySelector(".table-scrollable > table");
                                if (tabela) {
                                    console.log("✅ Tabela encontrada!");

                                    const linhas = tabela.querySelectorAll("tbody > tr");
                                    if (linhas.length > 0) {
                                        linhas.forEach((linha) => {
                                            const curso = linha.querySelector("td:nth-child(1)")?.textContent.trim() || "N/A";
                                            const linkDesempenho = linha.querySelector("td:nth-child(6) > div > a[href*='/desempenho']")?.href;
                                            const idDesempenho = linkDesempenho?.match(/(\d+)/)?.[1]; // Extrai a parte numérica do link

                                            if (curso === nomeCurso) {
                                                console.log(`🎯 Curso encontrado para ${aluno}: ${curso}`);
                                                console.log(`   ID de Desempenho: ${idDesempenho || "Não encontrado"}`);
                                                resultados.push([aluno, idDesempenho || "Não encontrado"]);
                                            }
                                        });
                                    } else {
                                        console.warn("⚠️ Nenhuma linha encontrada na tabela.");
                                    }
                                } else {
                                    console.warn("⚠️ Tabela não encontrada no HTML.");
                                }
                            } else {
                                console.error(`❌ Erro ao acessar /andamento para ${aluno}: ${andamentoResponse.status}`);
                            }
                        } else {
                            console.warn(`⚠️ Contrato não encontrado para ${aluno}`);
                        }
                    } else {
                        console.error(`❌ Erro ao buscar aluno ${aluno}: ${searchResponse.status}`);
                    }
                } catch (error) {
                    console.error(`⚠️ Erro ao processar o aluno ${aluno}: ${error.message}`);
                }
            }

            // Criar um novo arquivo XLSX com os resultados
            const newSheet = XLSX.utils.aoa_to_sheet(resultados);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Resultados");
            const newExcel = XLSX.write(newWorkbook, { bookType: "xlsx", type: "array" });

            // Criar um Blob e baixar o arquivo
            const blob = new Blob([newExcel], { type: "application/octet-stream" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "resultados.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("✅ Resultados processados e salvos em 'resultados.xlsx'.");
        };
    });

    // Simula um clique no input para selecionar o arquivo
    input.click();
})();