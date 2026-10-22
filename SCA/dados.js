// Funções compartilhadas para salvar e recuperar dados no navegador.
const SCA_STORAGE = {
  instituicoes: "sca_instituicoes",
  inventario: "sca_inventario"
};

function lerDados(chave) {
  try {
    const conteudo = localStorage.getItem(chave);
    return conteudo ? JSON.parse(conteudo) : [];
  } catch (erro) {
    console.error("Não foi possível ler os dados:", erro);
    return [];
  }
}

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function criarId() {
  return (window.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Mantém alguns itens demonstrativos quando o inventário ainda está vazio.
function garantirInventarioInicial() {
  const itens = lerDados(SCA_STORAGE.inventario);
  if (itens.length === 0) {
    salvarDados(SCA_STORAGE.inventario, [
      { id: criarId(), codigo: "AR-0231", modelo: "Fuzil de Assalto - Padrão", unidade: "1º Batalhão", status: "Disponível" },
      { id: criarId(), codigo: "PT-1042", modelo: "Pistola 9mm - Padrão", unidade: "Escolta Institucional", status: "Em uso" },
      { id: criarId(), codigo: "CB-0087", modelo: "Colete Balístico Nível III", unidade: "Segurança Privada", status: "Manutenção" },
      { id: criarId(), codigo: "RD-0459", modelo: "Rádio Tático Digital", unidade: "2º Batalhão", status: "Disponível" }
    ]);
  }
}
