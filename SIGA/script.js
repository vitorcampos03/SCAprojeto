// Chave no LocalStorage
const STORAGE_KEY = 'siga_dados';

// Obter dados do LocalStorage
function getDados() {
  const dados = localStorage.getItem(STORAGE_KEY);
  return dados ? JSON.parse(dados) : [];
}

// Salvar dados no LocalStorage
function saveDados(dados) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

// ----------------------------------------------------
// 1. MANIPULAÇÃO DO DOM E VALIDAÇÃO (cadastro.html)
// ----------------------------------------------------
function initCadastro() {
  const form = document.querySelector('form');
  if (!form || !window.location.pathname.includes('cadastro.html')) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Captura os inputs do formulário
    const inputNome = document.getElementById('nome') || document.querySelector('input[type="text"]');
    const inputEmail = document.getElementById('email') || document.querySelector('input[type="email"]');

    const nome = inputNome ? inputNome.value.trim() : '';
    const email = inputEmail ? inputEmail.value.trim() : '';

    // Validação de formulário
    if (nome.length < 3) {
      alert('Por favor, introduza um nome com pelo menos 3 caracteres.');
      return;
    }

    if (!email.includes('@')) {
      alert('Por favor, introduza um e-mail válido.');
      return;
    }

    // Criar registo (CREATE)
    const dados = getDados();
    const novoItem = {
      id: Date.now().toString(),
      nome,
      email,
      data: new Date().toLocaleDateString('pt-BR')
    };

    dados.push(novoItem);
    saveDados(dados);

    alert('Registo guardado com sucesso!');
    form.reset();
  });
}

// ----------------------------------------------------
// 2. LISTAGEM E ELIMINAÇÃO (gerenciar.html)
// ----------------------------------------------------
function initGerenciar() {
  const tabela = document.querySelector('table tbody') || document.getElementById('lista-itens');
  if (!tabela || !window.location.pathname.includes('gerenciar.html')) return;

  function renderizar() {
    const dados = getDados();
    tabela.innerHTML = '';

    if (dados.length === 0) {
      tabela.innerHTML = '<tr><td colspan="4">Nenhum registo encontrado.</td></tr>';
      return;
    }

    dados.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.email}</td>
        <td>${item.data}</td>
        <td>
          <button class="btn-editar" data-id="${item.id}">Editar</button>
          <button class="btn-excluir" data-id="${item.id}">Eliminar</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  }

  // Eventos de clique (DELETE e NAVEGAÇÃO PARA EDIÇÃO)
  tabela.addEventListener('click', function (e) {
    const id = e.target.getAttribute('data-id');

    if (e.target.classList.contains('btn-excluir')) {
      if (confirm('Deseja realmente eliminar este registo?')) {
        const dadosAtualizados = getDados().filter((item) => item.id !== id);
        saveDados(dadosAtualizados);
        renderizar();
      }
    }

    if (e.target.classList.contains('btn-editar')) {
      window.location.href = `editar.html?id=${id}`;
    }
  });

  renderizar();
}

// ----------------------------------------------------
// 3. EDIÇÃO DE REGISTO (editar.html)
// ----------------------------------------------------
function initEditar() {
  const form = document.querySelector('form');
  if (!form || !window.location.pathname.includes('editar.html')) return;

  const urlParams = new URLSearchParams(window.location.search);
  const idParaEditar = urlParams.get('id');

  if (!idParaEditar) return;

  const dados = getDados();
  const registo = dados.find((item) => item.id === idParaEditar);

  if (registo) {
    const inputNome = document.getElementById('nome') || document.querySelector('input[type="text"]');
    const inputEmail = document.getElementById('email') || document.querySelector('input[type="email"]');

    if (inputNome) inputNome.value = registo.nome;
    if (inputEmail) inputEmail.value = registo.email;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      registo.nome = inputNome.value.trim();
      registo.email = inputEmail.value.trim();

      saveDados(dados);
      alert('Registo atualizado!');
      window.location.href = 'gerenciar.html';
    });
  }
}

// Executa ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  initCadastro();
  initGerenciar();
  initEditar();
});