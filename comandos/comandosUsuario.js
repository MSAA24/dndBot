
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { saveUser, getUser, deleteUser } = require("../controllers/usuarioController.js");


client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!registro")) {
        await saveUser(message.author.id, message.author.username);
        message.reply("Tu usuario ha sido registrado.");
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
    if (message.content.startsWith("!miPerfil")) {
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
        // Verifica si el usuario tiene el rol "Admin"
        const adminRole = message.member.roles.cache.find(role => role.name === "Admin");
        if (!adminRole) {
            return message.reply("❌ No tienes permiso para usar este comando.");
        }

        // Obtiene el ID del usuario a eliminar
        const args = message.content.split(" ");
        if (args.length < 2) {
            return message.reply("⚠️ Debes especificar el ID del usuario. Ejemplo: `!eliminarPerfil 123456789`");
        }

        const userID = args[1];

        try {
            await deleteUser(userID);
            message.reply(`✅ El usuario con ID **${userID}** ha sido eliminado correctamente.`);
        } catch (error) {
            console.error("❌ Error al eliminar el usuario:", error);
            message.reply("⚠️ Hubo un error al eliminar el perfil. Verifica que el ID sea correcto.");
        }
    }
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!gay")) {
        const numeroAleatorio = Math.floor(Math.random() * 101); // Números del 0 al 100
        if (message.author.id == "219694352895574018"){
            message.reply ("Sos 200% homosexual")
        }
        else {
            message.reply(`Sos ${numeroAleatorio}% homosexual`);
        }
        
    }
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!comandos")) {
        const embed = new EmbedBuilder()
            .setTitle("📜 Lista de Comandos")
            .setDescription("Aquí están los comandos disponibles..")
            .addFields(
                { name: "!clima", value: "Muestra el clima actual.", inline: true },
                { name: "!verPerfil", value: "Muestra tu perfil de usuario.", inline: true },
            )
            .setColor("#00ff00")
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
});

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!admin")) {
        const embed = new EmbedBuilder()
            .setTitle("📜 Lista de Comandos de Admin")
            .setDescription("Aquí están los comandos disponibles..")
            .addFields(
                { name: "!eliminarPerfil", value: "Se elimina el perfil con el ID especificado.", inline: false },
                { name: "!cambiarClima", value: "Cambia el clima actual.", inline: false },
            )
            .setColor("#00ff00")
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
});



client.login(process.env.TOKEN);
