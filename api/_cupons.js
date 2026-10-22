const PRODUTOS = require('../produtos.js');

// ===== CADASTRO DE CUPONS: edite só aqui =====
// percentual: % de desconto sobre os produtos (não incide no frete)
// validoAte:  data limite (AAAA-MM-DD), opcional
// ativo:      false desliga o cupom sem apagar
const CUPONS = {
  PRIMEIRA10: { percentual: 10, validoAte: '2025-12-31', ativo: true },
  AMIGO15:    { percentual: 15, validoAte: '2026-11-30', ativo: true },
};
// =============================================

const r2 = n => Math.round(n * 100) / 100;
const precoComDesconto = (preco, c) => r2(preco * (1 - c.percentual / 100));

function calcular(itens, codigo) {
  const c = CUPONS[String(codigo || '').trim().toUpperCase()];
  if (!c || !c.ativo) return { ok: false, erro: 'Cupom inválido.' };
  if (c.validoAte && new Date() > new Date(c.validoAte + 'T23:59:59-03:00'))
    return { ok: false, erro: 'Cupom expirado.' };

  let subtotal = 0, total = 0;
  for (const i of (itens || [])) {
    const p = PRODUTOS.find(x => x.id === i.id);
    if (!p) continue;
    const q = Math.max(1, parseInt(i.qtd) || 1);
    subtotal += p.preco * q;
    total += precoComDesconto(p.preco, c) * q;
  }
  if (!subtotal) return { ok: false, erro: 'Carrinho vazio.' };
  return { ok: true, cupom: c, subtotal: r2(subtotal), total: r2(total), desconto: r2(subtotal - total) };
}

module.exports = { calcular, precoComDesconto };
