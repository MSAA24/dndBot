const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!registro")) {
        await saveUser(message.author.id, message.author.username);
        message.reply("Tu información ha sido guardada en DynamoDB.");
    }
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!verperfil")) {
        const user = await getUser(message.author.id);
        if (user) {
            message.reply(`Hola ${user.username}, te registraste en: ${user.joinedAt}`);
        } else {
            message.reply("No encontré tu perfil en la base de datos.");
        }
    }
});


client.login(process.env.TOKEN);
