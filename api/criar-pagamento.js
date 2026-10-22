const { MercadoPagoConfig, Preference } = require('mercadopago');
const PRODUTOS = require('../produtos.js');
const { calcular, precoComDesconto } = require('./_cupons');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// >>> CONECTE AQUI AO SEU CÁLCULO DE FRETE (SuperFrete) <<<
// Deve recalcular as opções para o CEP/itens e devolver a que tiver o id escolhido,
// no formato { id, nome, preco, prazo }. O preço NUNCA deve vir do navegador.
// Sugestão: mova a lógica de api/frete.js para api/_frete.js exportando
// "async function calcularFrete(cep, itens)" que retorna a lista de opções.
async function obterFrete(freteId, cep, itens) {
  const { calcularFrete } = require('./_frete');
  const opcoes = await calcularFrete(cep, itens);
  return (opcoes || []).find(o => String(o.id) === String(freteId)) || null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    const { itens, cliente, cupom, entrega } = req.body || {};
    if (!Array.isArray(itens) || !itens.length || !cliente || !entrega)
      return res.status(400).json({ erro: 'Dados do pedido incompletos.' });

    // Cupom (recalculado no servidor)
    let cupomInfo = null;
    if (cupom) {
      const r = calcular(itens, cupom);
      if (!r.ok) return res.status(400).json({ erro: r.erro });
      cupomInfo = r.cupom;
    }

    // Itens com preço do catálogo do servidor
    const items = [];
    for (const i of itens) {
      const p = PRODUTOS.find(x => x.id === i.id);
      if (!p) return res.status(400).json({ erro: 'Produto não encontrado: ' + i.id });
      const qtd = Math.max(1, parseInt(i.qtd) || 1);
      if (i.tamanho && p.tamanhos && !p.tamanhos.includes(i.tamanho))
        return res.status(400).json({ erro: 'Tamanho inválido para ' + p.nome });
      const det = [i.tamanho, i.cor, i.estampa].filter(Boolean).join(' / ');
      items.push({
        id: p.id + '|' + (i.tamanho || '') + '|' + (i.estampa || '') + '|' + (i.cor || ''),
        title: p.nome + (det ? ' (' + det + ')' : ''),
        quantity: qtd,
        currency_id: 'BRL',
        unit_price: cupomInfo ? precoComDesconto(p.preco, cupomInfo) : p.preco
      });
    }

    // Entrega
    let descricaoEntrega = '';
    if (entrega.tipo === 'envio') {
      const frete = await obterFrete(entrega.freteId, String(cliente.cep || '').replace(/\D/g, ''),
        itens.map(i => ({ id: i.id, qtd: i.qtd })));
      if (!frete) return res.status(400).json({ erro: 'Opção de frete inválida. Recalcule o frete.' });
      items.push({ id: 'frete', title: 'Frete: ' + frete.nome, quantity: 1, currency_id: 'BRL', unit_price: Number(frete.preco) });
      descricaoEntrega = 'Envio: ' + frete.nome;
    } else if (entrega.tipo === 'retirada') {
      descricaoEntrega = 'Retirada/combinar: ' + (entrega.pontoId || '');
    } else {
      return res.status(400).json({ erro: 'Tipo de entrega inválido.' });
    }

    const base = process.env.SITE_URL || ('https://' + req.headers.host);
    const nomeCompleto = String(cliente.nome || '').trim();
    const [nome, ...resto] = nomeCompleto.split(' ');

    const pref = await new Preference(client).create({
      body: {
        items,
        payer: { name: nome, surname: resto.join(' '), email: cliente.email },
        back_urls: {
          success: base + '/retorno.html',
          pending: base + '/retorno.html',
          failure: base + '/retorno.html?status=erro'
        },
        auto_return: 'approved',
        statement_descriptor: 'TOONTURA',
        external_reference: 'TT-' + Date.now(),
        metadata: {
          cliente, entrega, cupom: cupomInfo ? String(cupom).toUpperCase() : null, descricaoEntrega
        }
      }
    });

    res.json({ url: pref.init_point });
  } catch (e) {
    console.error('criar-pagamento:', e);
    res.status(500).json({ erro: 'Erro interno ao processar pagamento' });
  }
};
