const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { getClima} = require("../controllers/climaController.js");

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!clima")) {
        try {
            const clima = await generarYGuardarClimaGlobal();
            message.reply(`El clima actual en el servidor es: ${clima}`);
        } catch (error) {
            message.reply("Hubo un error al obtener el clima.");
        }
    }
});

client.login(process.env.TOKEN);























client.login(process.env.TOKEN);

