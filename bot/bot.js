const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const {generarYGuardarClima} = require("../controllers/climaController.js");
//ID del canal del msj
const CHANNEL_ID = '1352871493343907891'; 
/*
client.on("ready", () => {

    // Configuramos el intervalo de 24 horas (24 horas = 24 * 60 * 60 * 1000 ms)
    setInterval(async () => {
        try {
            // Obtén el canal donde quieres enviar el mensaje
            const channel = await client.channels.fetch(CHANNEL_ID);

            // Envía el mensaje
            await channel.send('!cambiarClima');
            console.log('Mensaje enviado');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }, 10000); // 24 horas en milisegundos
});
*/

client.on("ready", async () => {
    console.log('Bot está listo y conectado');
    
    try {
        // Intentar obtener el canal
        const channel = await client.channels.fetch(CHANNEL_ID);

        // Verificar si se pudo obtener el canal
        if (!channel) {
            console.error('No se pudo encontrar el canal.');
            return;
        }

        console.log(`Canal encontrado: ${channel.name}`);

        // Configuramos el intervalo de 10 segundos para pruebas
        setInterval(async () => {
            try {
                console.log('Intentando enviar el mensaje');
                // Envía el mensaje
                await channel.send('¡El clima ha sido actualizado!');
                console.log('Mensaje enviado');
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
            }
        }, 10000);  // 10 segundos para probar
    } catch (error) {
        console.error('Error al obtener el canal:', error);
    }
});


client.login(process.env.TOKEN);