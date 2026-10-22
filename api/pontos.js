module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    whatsapp: String(process.env.WHATSAPP_LOJA || '').replace(/\D/g, ''),
    pontos: [
      { id: 'sjc',    nome: 'São José dos Campos', detalhe: 'Retirada em mãos, combinamos o local pelo WhatsApp' },
      { id: 'sp',     nome: 'São Paulo',           detalhe: 'Retirada em mãos, combinamos o local pelo WhatsApp' },
      { id: 'lavras', nome: 'Lavras',              detalhe: 'Retirada em mãos, combinamos o local pelo WhatsApp' },
      { id: 'combinar', nome: 'Combinar outro local', detalhe: 'Entrega combinada pelo WhatsApp', combinar: true }
    ]
  });
};
