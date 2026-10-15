// Funcionalidade da página cadastro.html: cadastro de instituição.
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.endsWith("cadastro.html")) return;

  const form = document.querySelector("form");
  if (!form) return;

  const campos = form.querySelectorAll("input, select");
  const nome = campos[0];
  const tipo = campos[1];
  const responsavel = campos[2];
  const matricula = campos[3];
  const email = campos[4];
  const senha = campos[5];

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (nome.value.trim().length < 3) {
      alert("Informe o nome da instituição com pelo menos 3 caracteres.");
      nome.focus();
      return;
    }
    if (!email.value.trim() || !email.checkValidity()) {
      alert("Informe um e-mail institucional válido.");
      email.focus();
      return;
    }
    if (senha.value.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      senha.focus();
      return;
    }

    const instituicoes = lerDados(SIGA_STORAGE.instituicoes);
    instituicoes.push({
      id: criarId(),
      nome: nome.value.trim(),
      tipo: tipo.value,
      responsavel: responsavel.value.trim(),
      matricula: matricula.value.trim(),
      email: email.value.trim(),
      
      dataCadastro: new Date().toLocaleDateString("pt-BR")
    });
    salvarDados(SIGA_STORAGE.instituicoes, instituicoes);

    alert("Cadastro de instituição salvo neste navegador!");
    form.reset();
  });
});
