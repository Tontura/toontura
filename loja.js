// Renderização dos cards dos produtos
function renderizarProdutos(categoria = 'todos') {
  const container = document.getElementById('grid');
  if (!container || typeof PRODUTOS === 'undefined') return;

  const lista = PRODUTOS.filter(p => categoria === 'todos' || p.categoria === categoria);

  container.innerHTML = lista.map(p => {
    // 1ª foto (padrão) e 4ª foto (hover) ou fallbacks caso tenha menos fotos
    const imgPadrao = p.imagem || (p.imagens && p.imagens[0]) || '';
    const imgHover = (p.imagens && p.imagens[3]) ? p.imagens[3] : (p.imagens && p.imagens[1]) || imgPadrao;

    // Tamanhos (se existirem no produto)
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

    // Estampas (se existirem no produto)
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
           onmouseenter="iniciarHoverCard(this, '${imgHover}')" 
           onmouseleave="cancelarHoverCard(this, '${imgPadrao}')">
        
        <div class="foto card-imagem-wrapper">
          ${p.categoria === 'camisetas' ? '<span class="tag">NOVA</span>' : ''}
          <img src="${imgPadrao}" id="img-${p.id}" alt="${esc(p.nome)}" class="img-produto" />
          
          <div class="retangulo-hover">
            ${tamanhosHTML}
            ${estampasHTML}
            <button type="button" class="btn-add-carrinho" onclick="adicionarDiretoCarrinho(event, '${p.id}')">
              🛒 ADICIONAR AO CARRINHO
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
}

// Timer do Hover (0,5s) com efeito Fade
let timersHover = {};

function iniciarHoverCard(cardElement, imgHoverUrl) {
  const id = cardElement.getAttribute('data-id');
  clearTimeout(timersHover[id]);

  timersHover[id] = setTimeout(() => {
    cardElement.classList.add("exibir-hover");
    const imgEl = cardElement.querySelector(".img-produto");
    
    if (imgEl && imgHoverUrl && imgEl.src !== imgHoverUrl) {
      imgEl.classList.add("trocando-imagem");
      setTimeout(() => {
        imgEl.src = imgHoverUrl;
        imgEl.classList.remove("trocando-imagem");
      }, 150);
    }
  }, 150); // 0.5s
}

function cancelarHoverCard(cardElement, imgPadraoUrl) {
  const id = cardElement.getAttribute('data-id');
  clearTimeout(timersHover[id]);

  cardElement.classList.remove("exibir-hover");
  const imgEl = cardElement.querySelector(".img-produto");
  
  if (imgEl && imgPadraoUrl) {
    imgEl.classList.add("trocando-imagem");
    setTimeout(() => {
      imgEl.src = imgPadraoUrl;
      imgEl.classList.remove("trocando-imagem");
    }, 150);
  }
}

// Seleção de tamanho e estampa diretamente no card
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

// Adicionar produto direto ao carrinho
function adicionarDiretoCarrinho(event, prodId) {
  event.stopPropagation();
  event.preventDefault();

  const btn = event.currentTarget;
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

  let carrinho = [];
  try {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  } catch (e) {
    carrinho = [];
  }

  const idx = carrinho.findIndex(i => i.id === item.id && i.tamanho === item.tamanho && i.estampa === item.estampa);
  if (idx > -1) {
    carrinho[idx].quantidade += 1;
  } else {
    carrinho.push(item);
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorHeader();

  // Feedback visual rápido no próprio botão antes de abrir a aba lateral
  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '✓ ADICIONADO!';
  btn.style.background = '#e61c24';
  btn.style.color = '#fff';

  setTimeout(() => {
    btn.innerHTML = textoOriginal;
    btn.style.background = '#fff';
    btn.style.color = '#000';
    abrirGavetaCarrinho();
  }, 400);
}

// Gaveta Lateral do Carrinho (Slide-over sem Blur)
function renderizarGavetaCarrinho() {
  let gaveta = document.getElementById('carrinho-gaveta');
  
  if (!gaveta) {
    gaveta = document.createElement('div');
    gaveta.id = 'carrinho-gaveta';
    gaveta.innerHTML = `
      <div class="gaveta-overlay" onclick="fecharGavetaCarrinho()"></div>
      <div class="gaveta-conteudo">
        <div class="gaveta-header">
          <h2>CARRINHO</h2>
          <button class="btn-fechar-gaveta" onclick="fecharGavetaCarrinho()">✕</button>
        </div>
        <div class="gaveta-itens" id="gaveta-itens"></div>
        <div class="gaveta-footer">
          <div class="gaveta-total">
            <span>TOTAL:</span>
            <strong id="gaveta-total-valor">R$ 0,00</strong>
          </div>
          <a href="carrinho.html" class="btn-finalizar-gaveta">FINALIZAR COMPRA</a>
        </div>
      </div>
    `;
    document.body.appendChild(gaveta);
  }

  const containerItens = document.getElementById('gaveta-itens');
  const containerTotal = document.getElementById('gaveta-total-valor');
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (carrinho.length === 0) {
    containerItens.innerHTML = '<p class="carrinho-vazio-msg">Seu carrinho está vazio.</p>';
    containerTotal.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  containerItens.innerHTML = carrinho.map((item, index) => {
    total += item.preco * item.quantidade;
    return `
      <div class="gaveta-item">
        <img src="${item.imagem}" alt="${esc(item.nome)}" />
        <div class="gaveta-item-info">
          <h4>${esc(item.nome)}</h4>
          <p>${item.tamanho ? 'Tamanho: ' + item.tamanho : ''} ${item.estampa ? '| Estampa: ' + item.estampa : ''}</p>
          <div class="gaveta-item-preco">${item.quantidade}x ${brl(item.preco)}</div>
        </div>
        <button class="gaveta-remover-btn" onclick="removerItemGaveta(${index})">✕</button>
      </div>
    `;
  }).join('');

  containerTotal.textContent = brl(total);
}

function abrirGavetaCarrinho() {
  renderizarGavetaCarrinho();
  const gaveta = document.getElementById('carrinho-gaveta');
  if (gaveta) gaveta.classList.add('ativa');
}

function fecharGavetaCarrinho() {
  const gaveta = document.getElementById('carrinho-gaveta');
  if (gaveta) gaveta.classList.remove('ativa');
}

function removerItemGaveta(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorHeader();
  renderizarGavetaCarrinho();
}

function atualizarContadorHeader() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const total = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = total;
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarContadorHeader();
});
