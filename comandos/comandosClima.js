const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { obtenerClimaGlobal} = require("../controllers/climaController.js");

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!clima")) {
        try {
            const clima = await obtenerClimaGlobal();
            message.reply(`El clima es: ${clima}`);
        } catch (error) {
            message.reply("Hubo un error al obtener el clima.");
        }
    }
});

client.login(process.env.TOKEN);























client.login(process.env.TOKEN);

