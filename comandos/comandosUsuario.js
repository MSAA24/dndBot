
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
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

client.on("messageCreate", async (message) => {
    // Evitar que el bot responda a sus propios mensajes
    if (message.author.bot) return;

    // Si el mensaje comienza con el comando '!miUsuario'
    if (message.content.startsWith("!miUsuario")) {
        const userId = message.author.id;  // Obtener el ID del autor del mensaje

        try {
            // Obtener la información del usuario desde la base de datos
            const usuario = await getUser(userId);  // Asegúrate de que getUser devuelva la información del usuario

            if (usuario) {
                // Formatear la información como texto
                const contenido = `
                    **Información del usuario:**
                    - ID: ${usuario.userID}
                    - Nombre: ${usuario.username}
                    - Fecha de registro: ${usuario.joinedAt}
                `;

                // Crear el archivo .txt con la información
                const filePath = './usuario.txt';
                fs.writeFileSync(filePath, contenido);

                // Crear un adjunto del archivo .txt
                const attachment = new AttachmentBuilder(filePath);

                // Enviar el archivo al canal
                await message.reply({ content: 'Aquí está la información de tu usuario:', files: [attachment] });

                // Eliminar el archivo después de 5 segundos (opcional)
                setTimeout(() => fs.unlinkSync(filePath), 5000);
            } else {
                message.reply('No se encontró información para este usuario.');
            }
        } catch (error) {
            console.error(error);
            message.reply('Ocurrió un error al obtener la información del usuario.');
        }
    }
});



client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!verPerfil")) {
        const user = await getUser(message.author.id);
        if (user) {
            message.reply(`Hola ${user.username}, te registraste en: ${user.joinedAt}`);
        } else {
            message.reply("No se encuentra tu perfil en la base de datos.");
        }
        const embed = new EmbedBuilder()
          .setTitle(`Mostrando usuario`)
          .setDescription(`**${name}** ha sido agregado a tu colección.`)
          .addFields(
            { name: 'Usuario:', value: level.toString(), inline: true },
            { name: 'Unido el:', value: characterClass, inline: true },
          )
          .setTimestamp()
          .setColor('#00ff00')
          //.setImage(imageUrl);
    }
});


client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!eliminarPerfil")) {
        await deleteUser(message.author.id, message.author.username);
        message.reply("Tu usuario ha sido eliminado");
    }
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!me")) {
        const userData = await getUser(userID);
        
        if (!userData) {
            return interaction.reply({
                content: "❌ No encontré tu información guardada.",
                ephemeral: true
            });
        }
        
        // Crear el embed con la información del usuario
        const embed = new EmbedBuilder()
            .setColor("#00ff00") // Color verde
            .setTitle("👤 Información del Usuario")
            .setThumbnail(interaction.user.displayAvatarURL()) // Avatar del usuario
            .addFields(
                { name: "🆔 ID", value: userData.userID, inline: true },
                { name: "📛 Nombre de Usuario", value: userData.username, inline: true },
                { name: "📅 Se unió el", value: userData.joinedAt, inline: false }
            )
            //.setFooter({ text: "Información obtenida desde DynamoDB" });
        
        return interaction.reply({ embeds: [embed] });      
    }
});








client.login(process.env.TOKEN);
