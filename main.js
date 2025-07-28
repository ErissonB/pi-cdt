const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth()
});

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
client.on('message' , async msg => {
  texto = removeAccents(msg.body.trim().toLowerCase());
  let chat = await msg.getChat();
  resetInactivityTimer(chat);
  console.log(texto + "(" + msg.from + ")");
})

// Saudação / Início
const palavrasIniciais = [
  "oi",
  "olá",
  "ola",
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
  calcas: ["calça", "calca", "calcas", "calças", "jeans", "pants", "trouser", "trousers"],
  acessorios: ["acessório", "acessorio", "acessorios", "acessórios", "óculos", "anel", "brinco", "colares", "cinto", "bolsa"],
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
        msg.reply(`Para visualizar esse catálogo acesse:\nhttps://site.com/catalogue/${categoria}`);
      }
    }
  }
})

// Atendente
const palavrasParaAtendente = [
  "falar com atendente",
  "quero falar com alguém",
  "quero falar com alguem",
  "quero atendimento",
  "me ajuda",
  "preciso de ajuda",
  "ajuda",
  "atendimento",
  "humano",
  "posso falar com atendente?",
  "atendente",
  "quero suporte",
  "suporte",
  "preciso falar com alguém",
  "preciso falar com alguem",
  "tem alguém aí?",
  "tem alguem ai?",
  "quero falar com uma pessoa",
  "falar com pessoa",
  "pessoa real",
  "chat humano",
  "quero um atendente",
  "me atende"
];

const mensagemAtendente = `💬 Certo!
Vou te encaminhar para um de nossos atendentes.
Por favor, aguarde um instante enquanto realizamos o atendimento. ⏳`;

client.on('message' , msg => {
    texto = removeAccents(msg.body.trim().toLowerCase());
    for(const sinonimo of palavrasParaAtendente) {
      const regex = new RegExp(`\\b${sinonimo}\\b`, 'i');
      if (texto == sinonimo) {
        msg.reply(mensagemAtendente);
        break;
      }
    }
})


// Verificador de inatividade
const userTimers = new Map();

function enviarMsgDespedida(chat) {
  chat.sendMessage(`👋 Foi um prazer falar com você! Até a próxima!`);
  userTimers.delete(chat);
}

function resetInactivityTimer(userId) {
  // Clear existing timer if present
  if (userTimers.has(userId)) {
    clearTimeout(userTimers.get(userId));
  }

  // Set new 20-second timer
  const timer = setTimeout(() => enviarMsgDespedida(userId), 120000);

  // Store the new timer
  userTimers.set(userId, timer);
}


// Start your client
client.initialize();

