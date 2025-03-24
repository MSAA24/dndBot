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
    {
        data: new SlashCommandBuilder()
            .setName('cambiar_clima')
            .setDescription('Cambia el clima'),
            
            
            async execute(interaction) {
                const adminRole = interaction.guild.roles.cache.find(role => role.name === 'Admin'); 
            
                if (!adminRole || !interaction.member.roles.cache.has(adminRole.id)) {
                    // Si no tiene el rol "Admin"
                    return interaction.reply({
                        content: '❌ No tienes permiso para usar este comando.',
                        ephemeral: true
                    });
                }
                
                try {
                    const clima = await generarYGuardarClima();
                    interaction.reply(`Se cambió el clima a: ${clima}`);
                } catch (error) {
                    interaction.reply("Hubo un error al cambiar el clima.");
                }
            }          
    }           
];

module.exports = comandosClima;