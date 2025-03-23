// Importar dependencias
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');  // SDK v3 para DynamoDB
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
//const { createCharacterCommand, execute  } = require("./comandos/comandosPersonaje.js");
const {cargarComandos} = require("./comandos/cargarComandos.js")
require('dotenv').config();
const autobot_ID = '1352871493343907891'; 
const { REST,Routes } = require('@discordjs/rest');

// Crear cliente de DynamoDB sin credenciales explícitas (las toma de EC2)
const dynamoDB = new DynamoDBClient({
    region: 'us-east-2'  // Asegúrate de poner la región correcta de tu instancia EC2
});

// Crear cliente de Discord
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent] 
});
client.login(process.env.TOKEN);

const commands = cargarComandos();
const commandsJSON = commands.map(cmd => cmd.data.toJSON());

// Cargar los archivos de comandos
const comandosPath = path.join(__dirname, 'comandos');
const archivosComandos = fs.readdirSync(comandosPath).filter(file => file.endsWith('.js'));

// Crear un array para almacenar los comandos
const comandos = [];

for (const file of archivosComandos) {
    const comando = require(path.join(comandosPath, file));
    comandos.push(comando); // Agregar cada comando al array
}

client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Evitar que el bot responda a sus propios mensajes

    // Buscar si el mensaje empieza con un comando
    for (const comando of comandos) {
        if (message.content.startsWith(`!${comando.name}`)) {
            try {
                await comando.execute(message); // Ejecutar el comando
            } catch (error) {
                console.error('Error al ejecutar el comando:', error);
                message.reply('Hubo un error al ejecutar el comando.');
            }
        }
    }
});

// Evento cuando recibe un mensaje
/*
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
*/
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

console.log('BOT listo.');
// Iniciar sesión con el token del bot
