document.addEventListener("DOMContentLoaded", () => {
  const corpoTabela = document.getElementById("corpo-inventario");
  if (!corpoTabela) return;

  function criarCelula(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
  }

  async function renderizar() {
    let itens = [];
    try {
      const resposta = await fetch("/api/inventario");
      if (!resposta.ok) throw new Error();
      itens = await resposta.json();
    } catch {
      corpoTabela.innerHTML = "";
      const tr = document.createElement("tr");
      const td = criarCelula("Erro ao carregar o inventário.");
      td.colSpan = 5;
      tr.appendChild(td);
      corpoTabela.appendChild(tr);
      return;
    }

    corpoTabela.innerHTML = "";

    if (itens.length === 0) {
      const tr = document.createElement("tr");
      const td = criarCelula('Nenhum item cadastrado. Clique em "+ Novo Item".');
      td.colSpan = 5;
      tr.appendChild(td);
      corpoTabela.appendChild(tr);
      return;
    }

    itens.forEach(item => {
      const tr = document.createElement("tr");
      tr.appendChild(criarCelula(item.codigo));
      tr.appendChild(criarCelula(item.modelo));
      tr.appendChild(criarCelula(item.unidade));
      tr.appendChild(criarCelula(item.status));

      const acoes = document.createElement("td");

      const editar = document.createElement("a");
      editar.href = `editar.html?id=${encodeURIComponent(item.id)}`;
      editar.textContent = "Editar";

      const remover = document.createElement("a");
      remover.href = "#";
      remover.textContent = "Remover";
      remover.addEventListener("click", async evento => {
        evento.preventDefault();
        if (!confirm(`Remover o item ${item.codigo} (${item.modelo})?`)) return;

        const resposta = await fetch(`/api/inventario/${item.id}`, { method: "DELETE" });
        if (resposta.ok) {
          renderizar();
        } else {
          alert("Não foi possível remover o item.");
        }
      });

      acoes.append(editar, document.createTextNode(" | "), remover);
      tr.appendChild(acoes);
      corpoTabela.appendChild(tr);
    });
  }

  renderizar();
});