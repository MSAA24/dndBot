const { Client, GatewayIntentBits } = require('discord.js');
const { obtenerClimaGlobal, generarYGuardarClima} = require("../controllers/climaController.js");
const {EmbedBuilder } = require('discord.js');
//const { SlashCommandBuilder } = require('@discordjs/builders');
/*
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent] 
    });


client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!climaSimple")) {
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

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!cambiarClima")) {
        try {
            const clima = await generarYGuardarClima();
            message.reply(`Se cambió el clima a: ${clima}`);
        } catch (error) {
            message.reply("Hubo un error al cambiar el clima.");
        }
    }
});


client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!clima")) {
        try {
            const clima = await obtenerClimaGlobal(); // Obtener el clima global
            if (clima) {
                // Crear el embed con el clima
                const embed = new EmbedBuilder()
                    .setTitle("🌍 Clima Actual")
                    .setDescription(`El clima actual es: **${clima.clima}**`)
                    .setColor('#1E90FF') // Puedes elegir el color que prefieras
                    .setTimestamp();

                message.reply({ embeds: [embed] }); // Enviar el embed con la información
            } else {
                message.reply("No se ha guardado un clima global aún.");
            }
        } catch (error) {
            console.error("Error al mostrar el clima:", error);
            message.reply("Hubo un error al obtener el clima.");
        }
    }
});
*/

module.exports = [
    {
    name: 'climaSimple',
        async execute(message) {
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
        }
    },
    
    {
        name: 'cambiarClima',
        async execute(message) {
            try {
                const clima = await generarYGuardarClima();
                message.reply(`Se cambió el clima a: ${clima}`);
            } catch (error) {
                message.reply("Hubo un error al cambiar el clima.");
            }
        }
    },
    {
        name: 'clima',
        async execute(message) {
            try {
                const clima = await obtenerClimaGlobal();
                if (clima) {
                    const embed = new EmbedBuilder()
                        .setTitle("🌍 Clima Actual")
                        .setDescription(`El clima actual es: **${clima.clima}**`)
                        .setColor('#1E90FF')
                        .setTimestamp();

                    message.reply({ embeds: [embed] });
                } else {
                    message.reply("No se ha guardado un clima global aún.");
                }
            } catch (error) {
                console.error("Error al mostrar el clima:", error);
                message.reply("Hubo un error al obtener el clima.");
            }
        }
    }
];