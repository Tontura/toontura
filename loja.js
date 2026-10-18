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

// Renderização dos produtos
function renderizarProdutos(categoria = 'todos') {
  const container = document.getElementById('grid');
  if (!container || typeof PRODUTOS === 'undefined') return;

  const lista = PRODUTOS.filter(p => categoria === 'todos' || p.categoria === categoria);

  container.innerHTML = lista.map(p => {
    const imgPadrao = p.imagem || (p.imagens && p.imagens[0]) || '';
    const imgHover = (p.imagens && p.imagens[3]) ? p.imagens[3] : imgPadrao;

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
          <img src="${imgPadrao}" id="img-${p.id}" alt="${esc(p.nome)}" class="img-produto" loading="lazy" />
          
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
}

// Timer do Hover (0.5s) com troca direta de imagem
let timersHover = {};

function iniciarHoverCard(cardElement, imgHoverUrl) {
  const id = cardElement.getAttribute('data-id');
  clearTimeout(timersHover[id]);

  timersHover[id] = setTimeout(() => {
    cardElement.classList.add("exibir-hover");
    const imgEl = cardElement.querySelector(".img-produto");
    if (imgEl && imgHoverUrl) {
      imgEl.src = imgHoverUrl;
    }
  }, 500); // 0,5 segundos
}

function cancelarHoverCard(cardElement, imgPadraoUrl) {
  const id = cardElement.getAttribute('data-id');
  clearTimeout(timersHover[id]);

  cardElement.classList.remove("exibir-hover");
  const imgEl = cardElement.querySelector(".img-produto");
  if (imgEl && imgPadraoUrl) {
    imgEl.src = imgPadraoUrl;
  }
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

// Adicionar ao carrinho e abrir gaveta lateral
function adicionarDiretoCarrinho(event, prodId) {
  event.stopPropagation();
  event.preventDefault();

  const card = document.getElementById(`card-${prodId}`);
  if (!card) return;

  const tamanho = card.getAttribute('data-tamanho-selecionado');
  const estampa = card.getAttribute('data-estampa-selecionada');
  const produto = PRO
