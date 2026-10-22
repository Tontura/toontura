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
    imagem: "img/cam-acesse-sua-mente-1-P.png",
    imagens: [
      "img/cam-acesse-sua-mente-1-P.png",
      "img/cam-acesse-sua-mente-2-P.png",
      "img/tabela-tamanho-P.png",
      "img/cam-acesse-sua-mente-4-P.png"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "chi-01",
    nome: "Acesse a Sua Mente ♦ Branca",
    categoria: "acessorios",
    preco: 49.9,
    imagem: "img/chi-01.png",
    imagens: ["img/chi-01.png"],
    tamanhos: ["35-37", "38-40", "41-43"]
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
