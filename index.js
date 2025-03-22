// Importar dependencias
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');  // SDK v3 para DynamoDB
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Si lo necesitas para Discord, pero AWS ya está en EC2

// Crear cliente de DynamoDB sin credenciales explícitas (las toma de EC2)
const dynamoDB = new DynamoDBClient({
    region: 'us-east-2'  // Asegúrate de poner la región correcta de tu instancia EC2
});

// Crear cliente de Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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
            // Ejecutar el comando pasando el mensaje, argumentos y la conexión a DynamoDB
            await client.commands.get(commandName).execute(message, args, dynamoDB);
        } catch (error) {
            console.error("Error al ejecutar el comando:", error);
            message.reply("Hubo un error al ejecutar el comando.");
        }
    }
});

const autobot_ID = '1352871493343907891'; 

client.on("ready", () => {

    // Configuramos el intervalo de 24 horas (24 horas = 24 * 60 * 60 * 1000 ms)
    setInterval(async () => {
        try {
            // Obtén el canal donde quieres enviar el mensaje
            const channel = await client.channels.fetch(autobot_ID);

            // Envía el mensaje
            await channel.send('!cambiarClima');
            console.log('Mensaje enviado');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos
});



// Iniciar sesión con el token del bot
client.login(process.env.TOKEN);
