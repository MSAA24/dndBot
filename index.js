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

const comandos = cargarComandos(); // Cargar los comandos desde la carpeta "comandos"

client.once('ready', async () => {
    const comandosRegistrados = [];
    
    // Registrar los comandos en Discord
    for (const comando of comandos) {
        comandosRegistrados.push(comando.data.toJSON());
    }

    try {
        await client.application.commands.set(comandosRegistrados); // Esto registra los comandos slash en Discord
        console.log('✅ Comandos slash registrados exitosamente:', comandosRegistrados.map(cmd => cmd.data.name).join(', '));
    } catch (error) {
        console.error('❌ Error al registrar los comandos slash:', error);
    }
});

// Manejar interacciones de comandos slash
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const comando = comandos.find(cmd => cmd.data.name === interaction.commandName);
    if (!comando) return;

    try {
        await comando.execute(interaction); // Ejecutar el comando correspondiente
    } catch (error) {
        console.error('❌ Error al ejecutar el comando:', error);
        await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
    }
});



/*
const comandos = cargarComandos();

// Evento para cuando se recibe un mensaje
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
client.login(process.env.TOKEN);