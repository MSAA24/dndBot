//const AWS = require('aws-sdk');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

require('dotenv').config();
/*
// Configurar AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

*/

// Instanciar DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Cargar los comandos desde la carpeta "comandos/"
client.commands = new Map();
const comandosPath = path.join(__dirname, 'comandos');
const archivosComandos = fs.readdirSync(comandosPath).filter(file => file.endsWith('.js'));

// Cargar todos los comandos en el mapa
for (const file of archivosComandos) {
    const comando = require(path.join(comandosPath, file));
    client.commands.set(comando.name, comando);
}

client.once('ready', () => {
    console.log(`Bot listo como ${client.user.tag}`);
});

// Evento cuando recibe un mensaje
client.on('messageCreate', async (message) => {
    // Ignorar si el mensaje es de un bot o no tiene el prefijo de comando
    if (!message.content.startsWith("!") || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Verificar si el comando existe
    if (client.commands.has(commandName)) {
        try {
            await client.commands.get(commandName).execute(message, args, dynamoDB);
        } catch (error) {
            console.error("Error al ejecutar el comando:", error);
            message.reply("Hubo un error al ejecutar el comando.");
        }
    }
});

client.login(process.env.TOKEN);
