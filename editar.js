// Funcionalidades da página editar.html: criar ou atualizar item do inventário.
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.endsWith("editar.html")) return;

  garantirInventarioInicial();
  const form = document.querySelector("form");
  if (!form) return;

  const campos = form.querySelectorAll("input, select");
  const codigo = campos[0];
  const modelo = campos[1];
  const unidade = campos[2];
  const status = campos[3];
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");
  let itens = lerDados(SIGA_STORAGE.inventario);
  const itemAtual = id ? itens.find(item => item.id === id) : null;

  if (itemAtual) {
    codigo.value = itemAtual.codigo;
    modelo.value = itemAtual.modelo;
    unidade.value = itemAtual.unidade;
    status.value = itemAtual.status;
  } else if (!id) {
    // Quando for um novo item, deixa os campos vazios.
    codigo.value = "";
    modelo.value = "";
    unidade.value = "";
  } else {
    alert("O item solicitado não foi encontrado.");
    window.location.href = "gerenciar.html";
    return;
  }

  form.addEventListener("submit", evento => {
    evento.preventDefault();

    if (!codigo.value.trim() || !modelo.value.trim() || !unidade.value.trim()) {
      alert("Preencha o código, o modelo e a unidade responsável.");
      return;
    }

    const dadosItem = {
      codigo: codigo.value.trim(),
      modelo: modelo.value.trim(),
      unidade: unidade.value.trim(),
      status: status.value
    };

    if (itemAtual) {
      itens = itens.map(item => item.id === itemAtual.id ? { ...item, ...dadosItem } : item);
    } else {
      itens.push({ id: criarId(), ...dadosItem });
    }

    salvarDados(SIGA_STORAGE.inventario, itens);
    alert(itemAtual ? "Item atualizado com sucesso!" : "Item cadastrado com sucesso!");
    window.location.href = "gerenciar.html";
  });
});
