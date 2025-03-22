
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { saveUser, getUser, deleteUser } = require("../controllers/usuarioController.js");


client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!registro")) {
        await saveUser(message.author.id, message.author.username);
        message.reply("Tu información ha sido guardada en la Base de Datos.");
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === '!getUsuario') {
        const user = await getUser(message.author.id); // Obtenemos el ID del usuario de los argumentos

        try {
            // Obtener la información del usuario desde la base de datos

            // Formatear la respuesta
            const contenido = `
                **Información del usuario:**
                - ID: ${user.userID}
                - Nombre: ${user.username}
                - Fecha en que se unió: ${user.joinedAt}
                
            `;

            // Responder al usuario en Discord
            await interaction.reply({ content: contenido });
        } catch (error) {
            await interaction.reply({ content: 'No se pudo obtener la información del usuario.', ephemeral: true });
        }
    }
});


/*
client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!verPerfil")) {
        const user = await getUser(message.author.id);
        if (user) {
            message.reply(`Hola ${user.username}, te registraste en: ${user.joinedAt}`);
        } else {
            message.reply("No se encuentra tu perfil en la base de datos.");
        }
    }
});¨
*/

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!eliminarPerfil")) {
        await deleteUser(message.author.id, message.author.username);
        message.reply("Tu usuario ha sido eliminado");
    }
});


client.login(process.env.TOKEN);
