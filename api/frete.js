const { calcularFrete } = require('./_frete');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  try {
    const { cep, itens } = req.body || {};
    const opcoes = await calcularFrete(cep, itens);
    if (!opcoes.length) return res.status(400).json({ erro: 'Nenhuma opção de frete para este CEP.' });
    res.json({ opcoes });
  } catch (e) {
    console.error('frete:', e);
    res.status(500).json({ erro: 'Erro ao calcular o frete.' });
  }
};
