// Funcionalidades da página editar.html: criar ou atualizar item do inventário.
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-item");
  if (!form) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const campos = {
    codigo: document.getElementById("codigo"),
    modelo: document.getElementById("modelo"),
    unidade: document.getElementById("unidade"),
    status: document.getElementById("status"),
  };

  // Modo edição: carrega os dados do item
  if (id) {
    document.title = "Editar Item - SCA";
    document.getElementById("titulo").textContent = "Editar Item do Inventário";
    document.getElementById("subtitulo").textContent = "Atualize os dados do equipamento selecionado.";
    document.getElementById("botao-salvar").textContent = "Salvar alterações";

    try {
      const resposta = await fetch(`/api/inventario/${encodeURIComponent(id)}`);
      if (!resposta.ok) throw new Error();
      const item = await resposta.json();
      for (const nome in campos) campos[nome].value = item[nome];
    } catch {
      alert("O item solicitado não foi encontrado.");
      window.location.href = "gerenciar.html";
      return;
    }
  } else {
    document.title = "Novo Item - SCA";
    document.getElementById("botao-salvar").textContent = "Cadastrar item";
  }

  form.addEventListener("submit", async evento => {
    evento.preventDefault();

    const dados = {};
    for (const nome in campos) dados[nome] = campos[nome].value.trim();

    if (!dados.codigo || !dados.modelo || !dados.unidade) {
      alert("Preencha o código, o modelo e a unidade responsável.");
      return;
    }

    const url = id ? `/api/inventario/${encodeURIComponent(id)}` : "/api/inventario";
    const metodo = id ? "PUT" : "POST";

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (resposta.ok) {
        alert(id ? "Item atualizado com sucesso!" : "Item cadastrado com sucesso!");
        window.location.href = "gerenciar.html";
        return;
      }

      const erro = await resposta.json().catch(() => ({}));
      alert(erro.erro || "Não foi possível salvar o item.");
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  });
});
