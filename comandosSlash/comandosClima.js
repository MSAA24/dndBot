const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder } = require('discord.js');
const { obtenerClimaGlobal, generarYGuardarClima} = require("../controllers/climaController.js");

const comandosClima = [
    {
        data: new SlashCommandBuilder()
            .setName('clima')
            .setDescription('Clima actual'),
            
            async execute(interaction) {
            try {
                const clima = await obtenerClimaGlobal();
                if (clima) {
                    const embed = new EmbedBuilder()
                        .setTitle("🌍 Clima Actual")
                        .setDescription(`El clima actual es: **${clima.clima}**`)
                        .setColor('#1E90FF')
                        .setTimestamp();
        
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    await interaction.reply("No se ha guardado un clima global aún.");
                }
            } catch (error) {
                console.error("Error al mostrar el clima:", error);
                await interaction.reply("Hubo un error al obtener el clima.");
            }

            }
            
    }, 
];

module.exports = comandosClima;