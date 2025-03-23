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

// Crear cliente de Discord
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent] 
});

// Cargar comandos desde la carpeta "comandos"
const comandos = cargarComandos(); 

// Registrar los comandos en Discord cuando el bot esté listo
client.once('ready', async () => {
    const comandosRegistrados = [];

    // Registrar los comandos en Discord
    for (const comando of comandos) {
        comandosRegistrados.push(comando.data.toJSON());
    }

    try {
        // Usar REST para registrar los comandos de forma confiable
        const { clientId, guildId } = process.env; // Asegúrate de tener estos datos en tu .env
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        console.log('🔄 Registrando comandos slash...');
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: comandosRegistrados,
        });

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
        // Ejecutar el comando correspondiente
        await comando.execute(interaction);
    } catch (error) {
        console.error('❌ Error al ejecutar el comando:', error);
        await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
    }
});

// Configuración del bot para enviar un mensaje cada 24 horas
client.on("ready", () => {
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