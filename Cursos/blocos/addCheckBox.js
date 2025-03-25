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

// Executar no console:
adicionarCheckboxLicoes();
