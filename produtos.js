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
    id: "eco-01",
    nome: "Ecobag ToonTura",
    categoria: "acessorios",
    preco: 39.9,
    imagem: "img/eco-01.png",
    imagens: ["img/eco-01.png"],
    tamanhos: ["Único"]
  }
];

if (typeof module !== "undefined") module.exports = PRODUTOS;
