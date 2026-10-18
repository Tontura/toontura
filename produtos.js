// produtos.js
// Dados do catálogo TOONTURA
const ESTAMPAS_CAMISETA = ["Frente", "Costas"];

const PRODUTOS = [
  {
    id: "cam-01",
    nome: "Sem Sinal / Fora do Ar",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/cam-fora-do-ar-1.png",
    imagens: [
      "img/cam-fora-do-ar-1.png",
      "img/cam-fora-do-ar-2.png",
      "img/cam-fora-do-ar-3.png",
      "img/cam-fora-do-ar-4.png"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "cam-02",
    nome: "Acesse A Sua Mente",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/cam-acesse-sua-mente-1.png",
    imagens: [
      "img/cam-acesse-sua-mente-1.png",
      "img/cam-acesse-sua-mente-2.png",
      "img/cam-acesse-sua-mente-3.png",
      "img/cam-acesse-sua-mente-4.png"
    ],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "cam-03",
    nome: "Camiseta 03",
    categoria: "camisetas",
    preco: 79.9,
    imagem: "img/cam-03.png",
    imagens: ["img/cam-03.png"],
    tamanhos: ["P", "M", "G", "GG"],
    estampas: ESTAMPAS_CAMISETA
  },
  {
    id: "chi-01",
    nome: "Chinelo ToonTura",
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
