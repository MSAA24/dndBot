const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');  // SDK v3 para DynamoDB
const { Client, GatewayIntentBits } = require('discord.js');
const { cargarComandos } = require("./comandos/cargarComandos.js");
require('dotenv').config();
const autobot_ID = '1352871493343907891'; 

// Crear cliente de DynamoDB sin credenciales explícitas (las toma de EC2)
const dynamoDB = new DynamoDBClient({
    region: 'us-east-2'  // Asegúrate de poner la región correcta de tu instancia EC2
});

// Verifica si las variables de entorno están cargadas correctamente
if (!process.env.CLIENT_ID || !process.env.GUILD_ID || !process.env.TOKEN) {
    console.error('❌ Faltan variables en el archivo .env: CLIENT_ID, GUILD_ID o TOKEN');
    process.exit(1);
}

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Cargar los comandos desde la carpeta "comandos"
const comandos = cargarComandos();

client.once('ready', () => {
    console.log(`El bot está listo. Conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Asegúrate de que el mensaje no sea de un bot
    if (message.author.bot) return;

    // Verificar si el mensaje comienza con un comando, por ejemplo, "!clima"
    const comando = message.content.split(" ")[0]; // Obtener el primer término (el comando)
    if (comando.startsWith('!')) {
        // Buscar el archivo de comando correspondiente
        const cmd = comandos.find((cmd) => cmd.name === comando.slice(1));
        if (cmd) {
            try {
                await cmd.execute(message);  // Ejecutar el comando
            } catch (error) {
                console.error(`Error al ejecutar el comando: ${comando}`, error);
                message.reply('Hubo un error al ejecutar el comando.');
            }
        }
    }
});


client.on("ready", () => {
    setInterval(async () => {
        try {
            const channel = await client.channels.fetch('1352871493343907891');  // ID de canal
            await channel.send('!cambiarClima');
            console.log('Mensaje enviado');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos
});

client.login(process.env.TOKEN);