const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { obtenerClimaGlobal, generarYGuardarClima} = require("../controllers/climaController.js");

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!clima")) {
        try {
            const clima = await obtenerClimaGlobal();
            if (clima) {
                message.reply(`El clima es: ${clima.clima}`);
            } else {
                message.reply("No se ha guardado un clima aún.");
            }
        } catch (error) {
            message.reply("Hubo un error al obtener el clima.");
        }
    } else if (message.content.startsWith("!cambiarClima")) {
        try {
            const clima = await generarYGuardarClima();
            message.reply(`Se cambió el clima a: ${clima}`);
        } catch (error) {
            message.reply("Hubo un error al cambiar el clima.");
        }
    }
});


client.login(process.env.TOKEN);























client.login(process.env.TOKEN);

