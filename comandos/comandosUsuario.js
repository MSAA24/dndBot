
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
        try {
            const user = await getUser(message.author.id); // Obtener el usuario desde la base de datos
            if (user) {
                const avatarURL = message.author.avatarURL({ size: 2048, dynamic: true })
                // Crear el embed con los datos del usuario
                const embed = new EmbedBuilder()
                    .setTitle(`Perfil de ${user.username}`)
                    .setDescription(`Acá se encuentra tu información.`)
                    .addFields(
                        { name: 'Usuario:', value: user.username, inline: true },
                        { name: 'Unido el:', value: user.joinedAt, inline: true }
                    )
                    .setThumbnail(avatarURL)
                    .setTimestamp()
                    .setColor('#00ff00'); // Puedes agregar una imagen si lo deseas con `.setImage(imageUrl)`
                
                message.reply({ embeds: [embed] }); // Enviar el embed como respuesta
            } else {
                message.reply("No se encuentra tu perfil en la base de datos.");
            }
        } catch (error) {
            console.error("Error al obtener el perfil:", error);
            message.reply("Hubo un error al intentar obtener tu perfil.");
        }
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
