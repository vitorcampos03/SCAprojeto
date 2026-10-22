// Funcionalidade da página gerenciar.html: listar, editar e remover armas/equipamentos.
// Os dados ficam no localStorage do navegador (ver dados.js).
document.addEventListener("DOMContentLoaded", () => {
  const corpoTabela = document.getElementById("corpo-inventario");
  if (!corpoTabela) return;

  garantirInventarioInicial();

  function criarCelula(texto) {
    const td = document.createElement("td");
    td.textContent = texto; // textContent evita injeção de HTML
    return td;
  }

  function renderizar() {
    const itens = lerDados(SCA_STORAGE.inventario);
    corpoTabela.innerHTML = "";

    if (itens.length === 0) {
      const tr = document.createElement("tr");
      const td = criarCelula("Nenhum item cadastrado. Clique em \"+ Novo Item\".");
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

      const separador = document.createTextNode(" | ");

      const remover = document.createElement("a");
      remover.href = "#";
      remover.textContent = "Remover";
      remover.addEventListener("click", evento => {
        evento.preventDefault();
        if (confirm(`Remover o item ${item.codigo} (${item.modelo})?`)) {
          const restantes = lerDados(SCA_STORAGE.inventario).filter(i => i.id !== item.id);
          salvarDados(SCA_STORAGE.inventario, restantes);
          renderizar();
        }
      });

      acoes.append(editar, separador, remover);
      tr.appendChild(acoes);
      corpoTabela.appendChild(tr);
    });
  }

  renderizar();
});
