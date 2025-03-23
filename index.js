const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');  // SDK v3 para DynamoDB
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { cargarComandos } = require("./comandos/cargarComandos.js");
require('dotenv').config();
const autobot_ID = '1352871493343907891'; 
const { REST, Routes } = require('@discordjs/rest');

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

client.once('ready', async () => {
    const comandosRegistrados = comandos.map(cmd => cmd.data.toJSON());

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        console.log('🔄 Registrando comandos slash...');

        // Usa Routes.applicationGuildCommands para registrar los comandos en un servidor específico
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: comandosRegistrados }
        );

        console.log('✅ Comandos slash registrados exitosamente');
    } catch (error) {
        console.error('❌ Error al registrar los comandos slash:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const comando = comandos.find(cmd => cmd.data.name === interaction.commandName);
    if (!comando) return;

    try {
        await comando.execute(interaction);
    } catch (error) {
        console.error('❌ Error al ejecutar el comando:', error);
        await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
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