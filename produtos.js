// produtos.js
// Dados do catálogo TOONTURA
const ESTAMPAS_CAMISETA = ["Frente", "Costas"];

const PRODUTOS = [
  {
    id: "cam-01",
    nome: "Fora do Ar ♦ Preta",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/fora-do-ar-1-P.jpg",
    imagens: [
      "img/fora-do-ar-1-P.jpg",
      "img/fora-do-ar-2-P.jpg",
      "img/tabela-tamanho-P.jpg",
      "img/fora-do-ar-4-P.jpg"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "cam-02",
    nome: "Fora do Ar ♦ Branca",
    categoria: "camisetas",
    preco: 79.9,
   imagem: "img/fora-do-ar-1-B.jpg",
    imagens: [
      "img/fora-do-ar-1-B.jpg",
      "img/fora-do-ar-2-B.jpg",
      "img/tabela-tamanho-B.jpg",
      "img/fora-do-ar-4-B.jpg"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "cam-03",
    nome: "Acesse a Sua Mente ♦ Preta",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/acesse-sua-mente-1-P.jpg",
    imagens: [
      "img/acesse-sua-mente-1-P.jpg",
      "img/acesse-sua-mente-2-P.jpg",
      "img/tabela-tamanho-P.jpg",
      "img/acesse-sua-mente-4-P.jpg"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "cam-04",
    nome: "Acesse a Sua Mente ♦ Branca",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/acesse-sua-mente-1-B.jpg",
    imagens: [
      "img/acesse-sua-mente-1-B.jpg",
      "img/acesse-sua-mente-2-B.jpg",
      "img/tabela-tamanho-B.jpg",
      "img/acesse-sua-mente-4-B.jpg"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "cam-05",
    nome: "Sem Internet ♦ Branca",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/sem-internet-1-B.jpg",
    imagens: [
      "img/sem-internet-1-B.jpg",
      "img/sem-internet-2-B.jpg",
      "img/tabela-tamanho-B.jpg",
      "img/sem-internet-4-B.jpg"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
   {
    id: "cam-06",
    nome: "Sem Internet ♦ Preta",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/sem-internet-1-P.jpg",
    imagens: [
      "img/sem-internet-1-P.jpg",
      "img/sem-internet-2-P.jpg",
      "img/tabela-tamanho-P.jpg",
      "img/sem-internet-4-P.jpg"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
];

if (typeof module !== "undefined") module.exports = PRODUTOS;
