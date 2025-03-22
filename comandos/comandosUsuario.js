
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

client.on("interactionCreate", async (interaction) => {
    // Si no es un comando de barra, salir
    if (!interaction.isCommand()) return;

    // Comando de barra: /getusuario
    if (interaction.commandName === "getusuario") {
        const idUsuario = interaction.options.getString("id"); // Obtener el ID del usuario

        try {
            // Obtener la información del usuario desde la base de datos
            const usuario = await getUser(message.autor.id);

            // Formatear la información como texto
            const contenido = `
                **Información del usuario:**
                - ID: ${usuario.userID}
                - Nombre: ${usuario.username}
                - Fecha de registro: ${usuario.joinedAt}
            `;

            // Crear el archivo .txt
            const filePath = './usuario.txt';
            fs.writeFileSync(filePath, contenido);

            // Crear un adjunto del archivo .txt
            const attachment = new AttachmentBuilder(filePath);

            // Responder al usuario con el archivo
            await interaction.reply({ content: 'Aquí está la información del usuario:', files: [attachment] });

            // Eliminar el archivo después de 5 segundos (opcional)
            setTimeout(() => fs.unlinkSync(filePath), 5000);
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
