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

const comandos = cargarComandos();

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;  // Ignorar mensajes de bots

    // Buscar si el mensaje es un comando
    const comando = comandos.find(cmd => message.content.startsWith(`!${cmd.nombre}`));

    if (comando) {
        try {
            await comando.ejecutar(message);  // Ejecutar la función del comando
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            message.reply('Hubo un error al ejecutar el comando.');
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