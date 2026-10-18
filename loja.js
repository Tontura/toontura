const brl = v => Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const lerCarrinho = () => { try { return JSON.parse(localStorage.getItem('carrinho')||'[]'); } catch(e){ return []; } };
const gravarCarrinho = c => localStorage.setItem('carrinho', JSON.stringify(c));
const qtdItem = i => Number(i.qtd||i.quantidade||1);
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function atualizaContador(){
  const el = document.getElementById('contador');
  if (el) el.textContent = lerCarrinho().reduce((s,i)=>s+qtdItem(i),0);
}

function addCarrinho(p, tamanho, cor, estampa){
  cor = cor||null; estampa = estampa||null;
  const c = lerCarrinho();
  const ex = c.find(i=>i.id===p.id && i.tamanho===tamanho && (i.cor||null)===cor && (i.estampa||null)===estampa);
  if (ex) { ex.qtd = qtdItem(ex)+1; ex.quantidade = ex.qtd; }
  else c.push({id:p.id,nome:p.nome,preco:p.preco,imagem:p.imagens[0],tamanho,cor,estampa,qtd:1,quantidade:1});
  gravarCarrinho(c); atualizaContador();
}

function voarParaCarrinho(imgEl){
  const alvo = document.querySelector('.cart-link');
  if (!imgEl || !alvo) return;
  const a = imgEl.getBoundingClientRect(), b = alvo.getBoundingClientRect();
  const c = imgEl.cloneNode();
  c.className = 'voando';
  c.style.cssText = `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px`;
  document.body.appendChild(c);
  requestAnimationFrame(()=>{
    c.style.transform = `translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.08)`;
    c.style.opacity = '.4';
  });
  setTimeout(()=>{ c.remove(); alvo.classList.add('bump'); setTimeout(()=>alvo.classList.remove('bump'),400); },800);
}

/* ===== Carrinho lateral ===== */
function montarCarrinhoLateral(){
  if (document.getElementById('cl') || document.getElementById('itens')) return; // não aparece em carrinho.html
  const el = document.createElement('div');
  el.id = 'cl';
  el.innerHTML = `
    <div class="cl-fundo" onclick="fecharCarrinhoLateral()"></div>
    <aside class="cl-painel" role="dialog" aria-label="Carrinho" aria-hidden="true">
      <div class="cl-topo"><span>Carrinho</span><button type="button" class="cl-x" onclick="fecharCarrinhoLateral()" aria-label="Fechar">✕</button></div>
      <div class="cl-aviso" id="cl-aviso" hidden></div>
      <div class="cl-itens" id="cl-itens"></div>
      <div class="cl-rodape">
        <div class="cl-total"><span>Total</span><span id="cl-total">R$ 0,00</span></div>
        <p class="cl-obs">Frete calculado na finalização da compra</p>
        <a class="btn cl-btn" href="carrinho.html">Finalizar compra</a>
        <button type="button" class="cl-cont" onclick="fecharCarrinhoLateral()">Continuar comprando</button>
      </div>
    </aside>`;
  document.body.appendChild(el);
}

function renderCarrinhoLateral(){
  const box = document.getElementById('cl-itens');
  if (!box) return;
  const c = lerCarrinho();
  let total = 0;
  box.innerHTML = !c.length ? '<p class="cl-vazio">Seu carrinho está vazio.</p>' : c.map((i,idx)=>{
    const q = qtdItem(i);
    total += Number(i.preco)*q;
    const det = [i.tamanho?'Tam. '+i.tamanho:'', i.cor, i.estampa].filter(Boolean).join(' · ');
    return `<div class="cl-item"><img src="${esc(i.imagem)}" alt="">
      <div class="cl-info"><strong>${esc(i.nome)}</strong><span>${esc(det)}</span><span>${brl(i.preco)}</span>
        <div class="cl-qtd"><button type="button" onclick="mudarQtdCarrinho(${idx},-1)" aria-label="Diminuir">−</button><span>${q}</span><button type="button" onclick="mudarQtdCarrinho(${idx},1)" aria-label="Aumentar">+</button></div></div>
      <button type="button" class="cl-rem" onclick="removerDoCarrinho(${idx})">Remover</button></div>`;
  }).join('');
  document.getElementById('cl-total').textContent = brl(total);
  atualizaContador();
}

function mudarQtdCarrinho(idx,d){
  const c = lerCarrinho(); if (!c[idx]) return;
  const n = Math.max(1,Math.min(20,qtdItem(c[idx])+d));
  c[idx].qtd = n; c[idx].quantidade = n;
  gravarCarrinho(c); renderCarrinhoLateral();
}
function removerDoCarrinho(idx){
  const c = lerCarrinho(); c.splice(idx,1);
  gravarCarrinho(c); renderCarrinhoLateral();
}
function abrirCarrinhoLateral(msg){
  const el = document.getElementById('cl'); if (!el) return;
  renderCarrinhoLateral();
  const av = document.getElementById('cl-aviso');
  av.hidden = !msg; if (msg) av.textContent = '✓ '+msg;
  el.classList.add('aberto');
  el.querySelector('.cl-painel').setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function fecharCarrinhoLateral(){
  const el = document.getElementById('cl'); if (!el) return;
  el.classList.remove('aberto');
  el.querySelector('.cl-painel').setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

/* ===== Aparecer ao rolar ===== */
function observarReveal(){
  const els = document.querySelectorAll('.reveal:not(.on)');
  if (!('IntersectionObserver' in window)) { els.forEach(e=>e.classList.add('on')); return; }
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if (e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target);} }),{threshold:.12});
  els.forEach(e=>io.observe(e));
}

document.addEventListener('DOMContentLoaded',()=>{
  atualizaContador(); montarCarrinhoLateral(); observarReveal();
  document.querySelectorAll('.cart-link').forEach(a=>a.addEventListener('click',e=>{
    if (document.getElementById('cl')) { e.preventDefault(); abrirCarrinhoLateral(); }
  }));
});
document.addEventListener('keydown',e=>{ if (e.key==='Escape') fecharCarrinhoLateral(); });
