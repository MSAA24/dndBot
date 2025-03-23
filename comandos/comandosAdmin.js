
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const {deleteUser } = require("../controllers/usuarioController.js");


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



