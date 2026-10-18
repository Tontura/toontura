// Renderização dos cards dos produtos na vitrine
function renderizarProdutos(lista) {
  const container = document.getElementById("produtos-container");
  if (!container) return;

  container.innerHTML = lista.map(prod => {
    // Imagem principal (index 0) e 4ª imagem do conjunto (index 3 ou fallback para a 1ª)
    const imgPadrao = prod.imagem || (prod.imagens && prod.imagens[0]);
    const imgHover = (prod.imagens && prod.imagens[3]) ? prod.imagens[3] : imgPadrao;

    // Tamanhos (P, M, G, GG)
    const tamanhosHTML = prod.tamanhos ? `
      <div class="hover-linha">
        <span class="hover-label">TAMANHO:</span>
        <div class="hover-opcoes">
          ${prod.tamanhos.map((t, idx) => `
            <button type="button" class="btn-opcao btn-tam ${idx === 0 ? 'ativo' : ''}" onclick="selecionarOpcao(event, '${prod.id}', 'tamanho', '${t}')">${t}</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    // Estampas (Frente, Costas)
    const estampasHTML = prod.estampas ? `
      <div class="hover-linha">
        <span class="hover-label">ESTAMPA:</span>
        <div class="hover-opcoes">
          ${prod.estampas.map((e, idx) => `
            <button type="button" class="btn-opcao btn-est ${idx === 0 ? 'ativo' : ''}" onclick="selecionarOpcao(event, '${prod.id}', 'estampa', '${e}')">${e}</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="card-produto" 
           id="card-${prod.id}"
           data-tamanho-selecionado="${prod.tamanhos ? prod.tamanhos[0] : ''}"
           data-estampa-selecionada="${prod.estampas ? prod.estampas[0] : ''}"
           onmouseenter="iniciarHoverCard(this, '${imgHover}')" 
           onmouseleave="cancelarHoverCard(this, '${imgPadrao}')">
        
        <div class="card-imagem-wrapper">
          <img src="${imgPadrao}" id="img-${prod.id}" alt="${prod.nome}" class="img-produto" />
          
          <!-- Retângulo que sobe de baixo para cima dentro da imagem -->
          <div class="retangulo-hover">
            ${tamanhosHTML}
            ${estampasHTML}
            <button type="button" class="btn-add-carrinho" onclick="adicionarDiretoCarrinho(event, '${prod.id}')">
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>

        <div class="card-info">
          <h3 class="produto-titulo">${prod.nome}</h3>
          <p class="produto-preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Timer para acionar o efeito após 1 segundo continuo com o mouse em cima
let timerHover = null;

function iniciarHoverCard(cardElement, imgHoverUrl) {
  timerHover = setTimeout(() => {
    cardElement.classList.add("exibir-hover");
    const imgEl = cardElement.querySelector(".img-produto");
    if (imgEl && imgHoverUrl) {
      imgEl.src = imgHoverUrl;
    }
  }, 1000); // 1000ms = 1 segundo
}

function cancelarHoverCard(cardElement, imgPadraoUrl) {
  clearTimeout(timerHover);
  cardElement.classList.remove("exibir-hover");
  const imgEl = cardElement.querySelector(".img-produto");
  if (imgEl && imgPadraoUrl) {
    imgEl.src = imgPadraoUrl;
  }
}

// Alterna os seletores ativados (Tamanho / Estampa)
function selecionarOpcao(event, prodId, tipo, valor) {
  event.stopPropagation();
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

// Adiciona o produto com as opções selecionadas ao carrinho
function adicionarDiretoCarrinho(event, prodId) {
  event.stopPropagation();
  const card = document.getElementById(`card-${prodId}`);
  const tamanho = card.getAttribute('data-tamanho-selecionado');
  const estampa = card.getAttribute('data-estampa-selecionada');

  const produto = PRODUTOS.find(p => p.id === prodId);
  if (!produto) return;

  const item = {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    imagem: produto.imagem,
    tamanho: tamanho,
    estampa: estampa,
    quantidade: 1
  };

  if (typeof adicionarAoCarrinho === 'function') {
    adicionarAoCarrinho(item);
  } else {
    console.log("Item adicionado:", item);
  }
}

// Renderização dos cards na vitrine da ToonTura
function renderizarProdutos(categoria = 'todos') {
  const container = document.getElementById('grid');
  if (!container || typeof PRODUTOS === 'undefined') return;

  const lista = PRODUTOS.filter(p => categoria === 'todos' || p.categoria === categoria);

  container.innerHTML = lista.map(p => {
    const imgPadrao = p.imagem || (p.imagens && p.imagens[0]);
    const imgHover = (p.imagens && p.imagens[3]) ? p.imagens[3] : imgPadrao;

    // Tamanhos (P, M, G, GG ou opções do acessório)
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

    // Estampas (Frente, Costas)
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
      <div class="card card-produto reveal" 
           id="card-${p.id}"
           data-id="${p.id}"
           data-tamanho-selecionado="${p.tamanhos ? p.tamanhos[0] : ''}"
           data-estampa-selecionada="${p.estampas ? p.estampas[0] : ''}"
           onmouseenter="iniciarHoverCard(this, '${imgHover}')" 
           onmouseleave="cancelarHoverCard(this, '${imgPadrao}')">
        
        <div class="foto card-imagem-wrapper">
          ${p.categoria === 'camisetas' ? '<span class="tag">NOVA</span>' : ''}
          <img src="${imgPadrao}" id="img-${p.id}" alt="${esc(p.nome)}" class="img-produto" loading="lazy" />
          
          <!-- Retângulo que sobe de baixo dentro da imagem -->
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

  if (typeof observarReveal === 'function') {
    observarReveal();
  }
}

// Timer de 1 segundo para alterar imagem e subir o retângulo
let timerHover = null;

function iniciarHoverCard(cardElement, imgHoverUrl) {
  timerHover = setTimeout(() => {
    cardElement.classList.add("exibir-hover");
    const imgEl = cardElement.querySelector(".img-produto");
    if (imgEl && imgHoverUrl) {
      imgEl.src = imgHoverUrl;
    }
  }, 1000);
}

function cancelarHoverCard(cardElement, imgPadraoUrl) {
  clearTimeout(timerHover);
  cardElement.classList.remove("exibir-hover");
  const imgEl = cardElement.querySelector(".img-produto");
  if (imgEl && imgPadraoUrl) {
    imgEl.src = imgPadraoUrl;
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
  const card = document.getElementById(`card-${prodId}`);
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

  if (typeof adicionarAoCarrinho === 'function') {
    adicionarAoCarrinho(item);
  } else {
    console.log("Adicionado ao carrinho:", item);
  }
}
