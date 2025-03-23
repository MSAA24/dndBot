const { DynamoDBClient } = require('@aws-sdk/client-dynamodb'); 
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { cargarComandos } = require("./cargarComandos.js");
//const { cargarComandosSlash } = require('./cargarComandosSlash.js');
require('dotenv').config();
const autobot_ID = '1352871493343907891'; 
const comandosPersonaje = require('./comandosSlash/comandosPersonaje.js');

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

// **Registrar los comandos slash en Discord**
async function registrarComandos() {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const comandosJSON = comandosPersonaje.map(cmd => cmd.data.toJSON()); // Convertir a JSON

    try {
        console.log('⏳ Registrando comandos en Discord...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: comandosJSON }
        );
        console.log('✅ Comandos registrados correctamente.');
    } catch (error) {
        console.error('❌ Error al registrar comandos:', error);
    }
}

// Evento cuando el bot está listo
client.once('ready', async () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    await registrarComandos();
});

// Manejo de interacciones de comandos slash
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = comandosPersonaje.find(cmd => cmd.data.name === interaction.commandName);
    if (!command) {
        console.error(`⚠️ Comando no encontrado: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error al ejecutar el comando Slash: ${interaction.commandName}`, error);
        await interaction.reply({ content: "Hubo un error al ejecutar este comando.", ephemeral: true });
    }
});

// El bot cambia el clima automáticamente cada 24hs
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