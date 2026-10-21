// ===== Auxiliares compartilhados por todas as páginas =====
function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function brl(v) {
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
}

function lerCarrinho() {
  try { return JSON.parse(localStorage.getItem('carrinho')) || []; }
  catch (e) { return []; }
}
function gravarCarrinho(c) {
  localStorage.setItem('carrinho', JSON.stringify(c));
  atualizarContadorHeader();
}
function qtdItem(i) { return i.quantidade || i.qtd || 1; }
function atualizaContador() { atualizarContadorHeader(); }

function atualizarContadorHeader() {
  const total = lerCarrinho().reduce((acc, item) => acc + qtdItem(item), 0);
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = total;
}

// Usada pela página do produto
function addCarrinho(p, tam, cor, est) {
  const c = lerCarrinho();
  const idx = c.findIndex(i =>
    i.id === p.id &&
    i.tamanho === tam &&
    (i.cor || null) === (cor || null) &&
    (i.estampa || null) === (est || null)
  );
  if (idx > -1) {
    c[idx].quantidade = qtdItem(c[idx]) + 1;
  } else {
    c.push({
      id: p.id,
      nome: p.nome,
      preco: p.preco,
      imagem: p.imagem || (p.imagens && p.imagens[0]) || '',
      tamanho: tam,
      cor: cor || null,
      estampa: est || null,
      quantidade: 1
    });
  }
  gravarCarrinho(c);
}

function abrirCarrinhoLateral() { abrirGavetaCarrinho(); }

// Animação da foto "voando" até o carrinho
function voarParaCarrinho(el) {
  const alvo = document.querySelector('.cart-link');
  if (!el || !alvo) return;
  const a = el.getBoundingClientRect(), b = alvo.getBoundingClientRect();
  const clone = el.cloneNode(true);
  Object.assign(clone.style, {
    position: 'fixed', left: a.left + 'px', top: a.top + 'px',
    width: a.width + 'px', height: a.height + 'px', objectFit: 'cover',
    zIndex: 10000, transition: 'all .8s ease-in-out', pointerEvents: 'none', margin: 0
  });
  document.body.appendChild(clone);
  requestAnimationFrame(() => {
    Object.assign(clone.style, {
      left: b.left + 'px', top: b.top + 'px',
      width: '20px', height: '20px', opacity: '.3'
    });
  });
  setTimeout(() => {
    clone.remove();
    alvo.classList.add('bump');
    setTimeout(() => alvo.classList.remove('bump'), 400);
  }, 800);
}

// ===== Renderização dos cards dos produtos (página inicial) =====
function renderizarProdutos(categoria = 'todos') {
  const container = document.getElementById('grid');
  if (!container || typeof PRODUTOS === 'undefined') return;

  const lista = PRODUTOS.filter(p => categoria === 'todos' || p.categoria === categoria);

  container.innerHTML = lista.map(p => {
    // 1ª foto (padrão) e 4ª foto (hover) ou fallbacks caso tenha menos fotos
    const imgPadrao = p.imagem || (p.imagens && p.imagens[0]) || '';
    const imgHover = (p.imagens && p.imagens[3]) ? p.imagens[3] : (p.imagens && p.imagens[1]) || imgPadrao;

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

          <!-- FOTO CLICÁVEL: leva para a página do produto -->
          <a href="produto.html?id=${p.id}" class="card-img-link">
            <img src="${imgPadrao}" id="img-${p.id}" alt="${esc(p.nome)}" class="img-produto" />
          </a>

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

// Hover do card: mostra o retângulo e troca a foto com fade
let timersHover = {};

function iniciarHoverCard(cardElement, imgHoverUrl) {
  const id = cardElement.getAttribute('data-id');
  clearTimeout(timersHover[id]);

  timersHover[id] = setTimeout(() => {
    cardElement.classList.add('exibir-hover');
    const imgEl = cardElement.querySelector('.img-produto');

    if (imgEl && imgHoverUrl && imgEl.getAttribute('src') !== imgHoverUrl) {
      imgEl.classList.add('trocando-imagem');
      setTimeout(() => {
        imgEl.src = imgHoverUrl;
        imgEl.classList.remove('trocando-imagem');
      }, 150);
    }
  }, 150);
}

function cancelarHoverCard(cardElement, imgPadraoUrl) {
  const id = cardElement.getAttribute('data-id');
  clearTimeout(timersHover[id]);

  cardElement.classList.remove('exibir-hover');
  const imgEl = cardElement.querySelector('.img-produto');

  if (imgEl && imgPadraoUrl && imgEl.getAttribute('src') !== imgPadraoUrl) {
    imgEl.classList.add('trocando-imagem');
    setTimeout(() => {
      imgEl.src = imgPadraoUrl;
      imgEl.classList.remove('trocando-imagem');
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

// Adicionar produto direto ao carrinho (pelo card)
function adicionarDiretoCarrinho(event, prodId) {
  event.stopPropagation();
  event.preventDefault();

  const btn = event.currentTarget;
  const card = document.getElementById(`card-${prodId}`);
  if (!card) return;

  const tamanho = card.getAttribute('data-tamanho-selecionado') || null;
  const estampa = card.getAttribute('data-estampa-selecionada') || null;
  const produto = PRODUTOS.find(p => p.id === prodId);
  if (!produto) return;

  addCarrinho(produto, tamanho, null, estampa);

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

// ===== Gaveta lateral do carrinho =====
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
  const carrinho = lerCarrinho();

  if (carrinho.length === 0) {
    containerItens.innerHTML = '<p class="carrinho-vazio-msg">Seu carrinho está vazio.</p>';
    containerTotal.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  containerItens.innerHTML = carrinho.map((item, index) => {
    const q = qtdItem(item);
    total += item.preco * q;
    const det = [
      item.tamanho ? 'Tamanho: ' + item.tamanho : '',
      item.estampa ? 'Estampa: ' + item.estampa : '',
      item.cor ? 'Cor: ' + item.cor : ''
    ].filter(Boolean).join(' | ');
    return `
      <div class="gaveta-item">
        <img src="${esc(item.imagem)}" alt="${esc(item.nome)}" />
        <div class="gaveta-item-info">
          <h4>${esc(item.nome)}</h4>
          <p>${esc(det)}</p>
          <div class="gaveta-item-preco">${q}x ${brl(item.preco)}</div>
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
  const carrinho = lerCarrinho();
  carrinho.splice(index, 1);
  gravarCarrinho(carrinho);
  renderizarGavetaCarrinho();
}

// ===== Inicialização =====
document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorHeader();

  // Faz os elementos .reveal aparecerem ao rolar (sem isso ficam invisíveis)
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});
