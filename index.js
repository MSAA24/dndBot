const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');  // SDK v3 para DynamoDB
const { Client, GatewayIntentBits } = require('discord.js');
const cargarComandos = require("./cargarComandos.js"); 
const cargarComandosSlash = require('./cargarComandosSlash');  
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

// Configuración del bot con intents necesarios
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Cargar los comandos desde la carpeta "comandos"
const comandos = cargarComandos();

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
                console.error(`❌ Error al ejecutar el comando: ${comando}`, error);
                message.reply('⚠️ Hubo un error al ejecutar el comando.');
            }
        }
    }
});

// Cuando el bot esté listo
client.once('ready', async () => {
    console.log(`✅ El bot está listo. Conectado como ${client.user.tag}`);

    try {
        const comandosSlash = cargarComandosSlash();  // Llama a la función correctamente

        // Registra los comandos Slash globalmente
        await client.application.commands.set(comandosSlash);
        console.log("✅ Comandos Slash registrados correctamente");

    } catch (error) {
        console.error("❌ Error al registrar comandos Slash:", error);
    }

    // Configurar el mensaje automático de cambio de clima cada 24h
    setInterval(async () => {
        try {
            const channel = await client.channels.fetch(autobot_ID);
            await channel.send('!cambiarClima');
            console.log('🌦️ Mensaje de cambio de clima enviado');
        } catch (error) {
            console.error('❌ Error al enviar el mensaje:', error);
        }
    }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos
});

client.login(process.env.TOKEN);