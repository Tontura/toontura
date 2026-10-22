const { calcular } = require('./_cupons');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  const { codigo, itens } = req.body || {};
  const r = calcular(itens, codigo);
  if (!r.ok) return res.status(400).json({ erro: r.erro });
  res.json({ desconto: r.desconto, subtotal: r.subtotal, total: r.total });
};
