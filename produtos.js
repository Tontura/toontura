const PRODUTOS = [
  { id:'cam-fora-do-ar', nome:'Camiseta Fora do Ar', categoria:'camisetas', preco:89.9,
    desc:'O sistema está fora do ar. Frente ou costas, preta ou branca.',
    imagens:['img/cam-fora-do-ar-1.png','img/cam-fora-do-ar-2.png'],
    tamanhos:['P','M','G','GG'], estampas:['Frente','Costas'],
    cores:[{nome:'Preta',hex:'#111111'},{nome:'Branca',hex:'#f2f2f2'}] },

  { id:'cam-acesse-sua-mente', nome:'Camiseta Acesse sua Mente', categoria:'camisetas', preco:89.9,
    desc:'Desbloqueie seu potencial. Frente ou costas, preta ou branca.',
    imagens:['img/cam-acesse-sua-mente-1.png','img/cam-acesse-sua-mente-2.png'],
    tamanhos:['P','M','G','GG'], estampas:['Frente','Costas'],
    cores:[{nome:'Preta',hex:'#111111'},{nome:'Branca',hex:'#f2f2f2'}] },

  { id:'cam-sem-internet', nome:'Camiseta Sem Internet', categoria:'camisetas', preco:89.9,
    desc:'Sem internet lá fora! Frente ou costas, preta ou branca.',
    imagens:['img/cam-sem-internet-1.png','img/cam-sem-internet-2.png'],
    tamanhos:['P','M','G','GG'], estampas:['Frente','Costas'],
    cores:[{nome:'Preta',hex:'#111111'},{nome:'Branca',hex:'#f2f2f2'}] },

  { id:'cam-capture', nome:'Camiseta Capture', categoria:'camisetas', preco:89.9,
    desc:'Capture (ideias bem-vindas). Frente ou costas, preta ou branca.',
    imagens:['img/cam-capture-1.png','img/cam-capture-2.png'],
    tamanhos:['P','M','G','GG'], estampas:['Frente','Costas'],
    cores:[{nome:'Preta',hex:'#111111'},{nome:'Branca',hex:'#f2f2f2'}] },

  { id:'cam-destruir', nome:'Camiseta Destruir', categoria:'camisetas', preco:89.9,
    desc:'Somente branca, com estampa na frente e nas costas.',
    imagens:['img/cam-destruir-1.png','img/cam-destruir-2.png'],
    tamanhos:['P','M','G','GG'],
    cores:[{nome:'Branca',hex:'#f2f2f2'}] },

  { id:'chi-na-web', nome:'Chinelo Na Web', categoria:'acessorios', preco:59.9,
    desc:'O chinelo da ToonTura.',
    imagens:['img/chinelo-1.png'],
    tamanhos:['34/35','36/37','38/39','40/41','42/43'],
    pacote:{ width:12, height:10, length:30, weight:0.4 } },

  { id:'eco-ser-humano', nome:'Ecobag Ser Humano', categoria:'acessorios', preco:39.9,
    desc:'Ecobag ToonTura.',
    imagens:['img/ecobag-1.png'],
    tamanhos:['Único'],
    pacote:{ width:25, height:2, length:30, weight:0.15 } }
];

if (typeof module !== 'undefined') module.exports = PRODUTOS;
