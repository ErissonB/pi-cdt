const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const client = new Client();

const removeAccents = (string) => {return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
	qrcode.generate(qr, {small: true});
});

// Teste de recepção
client.on('message' , msg => {
  texto = removeAccents(msg.body.trim().toLowerCase());
  console.log(texto);
})

// Saudação / Início
const palavrasIniciais = [
  "oi",
  "olá",
  "bom dia",
  "boa tarde",
  "boa noite",
  "quero comprar",
  "quero ver roupas",
  "me mostra as roupas",
  "tem promoção?",
  "quais são os produtos?",
  "tem novidades?",
  "quero ver novidades",
  "quero ver lançamentos",
  "como funciona?",
  "como faço para comprar?",
  "quero atendimento",
  "quero ajuda",
  "pode me ajudar?",
  "quero fazer um pedido",
  "posso comprar aqui?",
  "quero roupas femininas",
  "quero roupas masculinas",
  "tem roupas unissex?",
  "moda feminina",
  "moda masculina",
  "moda unissex"
];

const mensagemBoasVindas = `👋 Olá! Seja bem-vindo(a) à Conexão das Tribos!
Estamos aqui para te ajudar a encontrar o look perfeito. 👗👕👖

Você pode:
🛍️ Digite uma das categorias a seguir para receber o catálogo específico ou digite _catálogo_ para ver todos os produtos.
   - Camisas
   - Calças
   - Acessórios
   - Corset
   - Body
   - Cropped

⏰ Perguntar sobre nosso horário de atendimento.
💬 Falar com um atendente digitando: Atendente.

É só me dizer o que deseja! 😊`

client.on('message', msg => {
    texto = removeAccents(msg.body.trim().toLowerCase());
    for (const palavra of palavrasIniciais) {
      const regex = new RegExp(`\\b${palavra}\\b`, 'i');
      if (regex.test(texto)) {
        msg.reply(mensagemBoasVindas);
        break;
      }
    }
});


// Mensagem de horário
const horarios = 'Os Nossos horários de atendimento são:\n' +
'- Segunda a Sexta: 09:00 - 18:00\n' +
'- Sábado: 09:00 - 14:00\n'+
'- Domingo: Fechado\n';

client.on('message', msg => {
    texto = removeAccents(msg.body.trim().toLowerCase());
    if (texto.includes("horario")) {
        msg.reply(horarios)
    }
})

// Catálogo Geral
const mensagemCatalogo = `🛍️ Aqui está o nosso catálogo completo!
Confira todas as opções disponíveis no nosso site:
👉 https://site.com/catalogo

Se quiser ajuda para encontrar algo específico, é só me avisar! 😊
`
const palavrasCatalogo = ["catálogo","catalogo","produtos","opções","opcoes","ver tudo","lista"];

client.on('message' , msg => {
    texto = removeAccents(msg.body.trim().toLowerCase());
    for(const sinonimo of palavrasCatalogo) {
      const regex = new RegExp(`\\b${sinonimo}\\b`, 'i');
      if (texto == sinonimo) {
        msg.reply(mensagemCatalogo);
        break;
      }
    }
})

// Catálogo de Categoria
const categoryMap = {
  camisas: ["camisa", "camisas", "t-shirt", "tshirts", "t-shirts", "blusa", "blusas"],
  calcas: ["calça", "calcas", "calças", "jeans", "pants", "trouser", "trousers"],
  acessorios: ["acessório", "acessorios", "acessórios", "óculos", "anel", "brinco", "colares", "cinto", "bolsa"],
  corset: ["corset", "espartilho", "corpete"],
  body: ["body", "bodies", "bodi", "bodie"],
  cropped: ["cropped", "crop", "croppeds", "top"]
};

client.on('message' , msg => {
    texto = removeAccents(msg.body.trim().toLowerCase());
    //console.log(texto);
    for (const [categoria, sinonimos] of Object.entries(categoryMap)) {
    for (const sinonimo of sinonimos) {
      const regex = new RegExp(`\\b${sinonimo}\\b`, 'i');
      if (regex.test(texto)) {
        msg.reply(`Para visualizar nosso catálogo de ${categoria} acesse:\nhttps://site.com/catalogue/${categoria}`);
      }
    }
  }
})

// Start your client
client.initialize();

