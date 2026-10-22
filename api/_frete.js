const PRODUTOS = require('../produtos.js');

// ===== AJUSTE AQUI: embalagem por categoria (cm e kg) =====
const EMBALAGEM = {
  camisetas:  { peso: 0.25, largura: 25, altura: 4, comprimento: 30 },
  acessorios: { peso: 0.20, largura: 25, altura: 4, comprimento: 30 }
};
const PADRAO = EMBALAGEM.camisetas;

// ===== Tabela fixa (usada quando não há token do Melhor Envio) =====
// Chave = primeiro dígito do CEP. Valores em reais, para 1 peça.
const TABELA = {
  '0': 18, '1': 18,          // São Paulo
  '2': 22, '3': 22,          // RJ, ES, MG
  '4': 28, '5': 28,          // BA, SE, PE, AL...
  '6': 32, '7': 32,          // Norte, Centro-Oeste
  '8': 26, '9': 26           // Sul
};
const ADICIONAL_POR_PECA = 3;  // somado a cada peça extra
const PRAZO_FIXO = '5 a 10';

function itensDetalhados(itens) {
  const lista = [];
  for (const i of (itens || [])) {
    const p = PRODUTOS.find(x => x.id === i.id);
    if (!p) continue;
    lista.push({ p, qtd: Math.min(50, Math.max(1, parseInt(i.qtd) || 1)) });
  }
  return lista;
}

function tabelaFixa(cep, itens) {
  const pecas = itens.reduce((a, i) => a + i.qtd, 0);
  const base = TABELA[cep[0]] || 30;
  const preco = base + ADICIONAL_POR_PECA * Math.max(0, pecas - 1);
  return [{ id: 'fixo', nome: 'Envio padrão', preco: Math.round(preco * 100) / 100, prazo: PRAZO_FIXO }];
}

async function melhorEnvio(cep, itens) {
  const origem = String(process.env.CEP_ORIGEM || '').replace(/\D/g, '');
  const body = {
    from: { postal_code: origem },
    to: { postal_code: cep },
    products: itens.map(({ p, qtd }) => {
      const e = EMBALAGEM[p.categoria] || PADRAO;
      return {
        id: p.id, width: e.largura, height: e.altura, length: e.comprimento,
        weight: e.peso, insurance_value: p.preco, quantity: qtd
      };
    })
  };
  const base = process.env.ME_SANDBOX === '1'
    ? 'https://sandbox.melhorenvio.com.br' : 'https://melhorenvio.com.br';
  const r = await fetch(base + '/api/v2/me/shipment/calculate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.MELHOR_ENVIO_TOKEN,
      'User-Agent': 'ToonTura (' + (process.env.MELHOR_ENVIO_EMAIL || 'contato@toontura.com') + ')'
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('Melhor Envio HTTP ' + r.status);
  const data = await r.json();
  return (Array.isArray(data) ? data : [])
    .filter(s => !s.error && (s.custom_price || s.price))
    .map(s => ({
      id: String(s.id),
      nome: ((s.company && s.company.name) ? s.company.name + ' ' : '') + s.name,
      preco: Math.round(Number(s.custom_price || s.price) * 100) / 100,
      prazo: s.custom_delivery_time || s.delivery_time || ''
    }))
    .sort((a, b) => a.preco - b.preco)
    .slice(0, 3);
}

async function calcularFrete(cepBruto, itensBrutos) {
  const cep = String(cepBruto || '').replace(/\D/g, '');
  if (cep.length !== 8) return [];
  const itens = itensDetalhados(itensBrutos);
  if (!itens.length) return [];

  if (process.env.MELHOR_ENVIO_TOKEN && process.env.CEP_ORIGEM) {
    try {
      const opcoes = await melhorEnvio(cep, itens);
      if (opcoes.length) return opcoes;
    } catch (e) {
      console.error('frete (Melhor Envio):', e.message);
    }
  }
  return tabelaFixa(cep, itens);   // plano B: nunca deixa o cliente sem frete
}

module.exports = { calcularFrete };
