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

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});


// Mensagem de horário
const horarios = 'Os Nossos horários de atendimento são:\n' +
'- Segunda a Sexta: 09:00 - 18:00\n' +
'- Sábado: 09:00 - 14:00\n'
'- Domingo: Fechado\n';

client.on('message', msg => {
    texto = removeAccents(msg.body.trim().toLowerCase());
    if (texto.includes("horario")) {
        msg.reply(horarios)
    }
})

// Start your client
client.initialize();

