// Auxiliares de formatação
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function brl(v) {
  return 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');
}

// Renderização dos produtos na vitrine
function renderizarProdutos(categoria = 'todos') {
  const container = document.getElementById('grid');
  if (!container || typeof PRODUTOS === 'undefined') return;

  const lista = PRODUTOS.filter(p => categoria === 'todos' || p.categoria === categoria);

  container.innerHTML = lista.map(p => {
    const imgPadrao = p.imagem || (p.imagens && p.imagens[0]) || '';
    const imgHover = (p.imagens && p.imagens[3]) ? p.imagens[3] : imgPadrao;

    // Tamanhos
    const tamanhosHTML = p.tamanhos ? `
      <div class="hover-linha">
        <span class="hover-label">TAMANHO:</span>
        <div class="hover-opcoes">
          ${p.tamanhos.map((t, idx) => `
            <button type="button" class="btn-opcao btn-tam ${idx === 0 ? 'ativo' : ''}" onclick="selecionarOpcao(event, '${p.id}', 'tamanho', '${t}')">${t}</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    // Estampas
    const estampasHTML = p.estampas ? `
      <div class="hover-linha">
        <span class="hover-label">ESTAMPA:</span>
        <div class="hover-opcoes">
          ${p.estampas.map((e, idx) => `
            <button type="button" class="btn-opcao btn-est ${idx === 0 ? 'ativo' : ''}" onclick="selecionarOpcao(event, '${p.id}', 'estampa', '${e}')">${e}</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="card card-produto" 
           id="card-${p.id}"
           data-id="${p.id}"
           data-tamanho-selecionado="${p.tamanhos ? p.tamanhos[0] : ''}"
           data-estampa-selecionada="${p.estampas ? p.estampas[0] : ''}"
           data-img-padrao="${imgPadrao}"
           data-img-hover="${imgHover}">
        
        <div class="foto card-imagem-wrapper">
          ${p.categoria === 'camisetas' ? '<span class="tag">NOVA</span>' : ''}
          <img src="${imgPadrao}" id="img-${p.id}" alt="${esc(p.nome)}" class="img-produto" loading="lazy" />
          
          <!-- Retângulo semi-transparente de opções -->
          <div class="retangulo-hover">
            ${tamanhosHTML}
            ${estampasHTML}
            <button type="button" class="btn-add-carrinho" onclick="adicionarDiretoCarrinho(event, '${p.id}')">
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>

        <a href="produto.html?id=${p.id}" class="card-link-detalhes">
          <h3>${esc(p.nome)}</h3>
          <div class="preco">${brl(p.preco)}</div>
        </a>
      </div>
    `;
  }).join('');

  configurarHoverEventos();
}

// Configuração robusta de Hover (usando pointer/mouse events sem interrupção pelos botões)
let timersHover = {};

function configurarHoverEventos() {
  document.querySelectorAll('.card-produto').forEach(card => {
    const id = card.getAttribute('data-id');
    const imgPadrao = card.getAttribute('data-img-padrao');
    const imgHover = card.getAttribute('data-img-hover');
    const imgEl = card.querySelector('.img-produto');

    card.addEventListener('mouseenter', () => {
      clearTimeout(timersHover[id]);
      timersHover[id] = setTimeout(() => {
        card.classList.add('exibir-hover');
        if (imgEl && imgHover) {
          imgEl.src = imgHover;
        }
      }, 500); // 0,5 segundos
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(timersHover[id]);
      card.classList.remove('exibir-hover');
      if (imgEl && imgPadrao) {
        imgEl.src = imgPadrao;
      }
    });
  });
}

// Seleção de Tamanho e Estampa
function selecionarOpcao(event, prodId, tipo, valor) {
  event.stopPropagation();
  event.preventDefault();
  const card = document.getElementById(`card-${prodId}`);
  if (!card) return;

  if (tipo === 'tamanho') {
    card.setAttribute('data-tamanho-selecionado', valor);
    card.querySelectorAll('.btn-tam').forEach(btn => btn.classList.remove('ativo'));
    event.currentTarget.classList.add('ativo');
  } else if (tipo === 'estampa') {
    card.setAttribute('data-estampa-selecionada', valor);
    card.querySelectorAll('.btn-est').forEach(btn => btn.classList.remove('ativo'));
    event.currentTarget.classList.add('ativo');
  }
}

// Adicionar direto ao carrinho com persistência garantida no localStorage
function adicionarDiretoCarrinho(event, prodId) {
  event.stopPropagation();
  event.preventDefault();

  const card = document.getElementById(`card-${prodId}`);
  if (!card) return;

  const tamanho = card.getAttribute('data-tamanho-selecionado');
  const estampa = card.getAttribute('data-estampa-selecionada');

  const produto = PRODUTOS.find(p => p.id === prodId);
  if (!produto) return;

  const item = {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    imagem: produto.imagem || (produto.imagens && produto.imagens[0]),
    tamanho: tamanho,
    estampa: estampa,
    quantidade: 1
  };

  // Garante adição ao localStorage do carrinho
  let carrinho = [];
  try {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  } catch (e) {
    carrinho = [];
  }

  // Verifica se já existe o mesmo produto com mesmo tamanho e mesma estampa
  const indexExistente = carrinho.findIndex(i => 
    i.id === item.id && i.tamanho === item.tamanho && i.estampa === item.estampa
  );

  if (indexExistente > -1) {
    carrinho[indexExistente].quantidade += 1;
  } else {
    carrinho.push(item);
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  // Atualiza contador do header se a função existir
  if (typeof atualizarContadorCarrinho === 'function') {
    atualizarContadorCarrinho();
  } else {
    const contadorEl = document.getElementById('contador');
    if (contadorEl) {
      const totalItens = carrinho.reduce((acc, i) => acc + (i.quantidade || 1), 0);
      contadorEl.textContent = totalItens;
    }
  }

  // Feedback visual rápido no botão
  const btn = event.currentTarget;
  const textoOriginal = btn.textContent;
  btn.textContent = 'ADICIONADO!';
  btn.style.background = '#e61c24';
  btn.style.color = '#fff';

  setTimeout(() => {
    btn.textContent = textoOriginal;
    btn.style.background = '#fff';
    btn.style.color = '#000';
  }, 1200);
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarProdutos('todos');
});
