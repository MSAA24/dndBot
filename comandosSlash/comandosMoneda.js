const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder } = require('discord.js');
const {crearMoneda,getMoneda} = require("../controllers/monedaController.js");

const comandosMoneda = [
    {
        data: new SlashCommandBuilder()
            .setName('crear_moneda')
            .setDescription('Crea una moneda para un usuario.')
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription('El nombre de la moneda')
                    .setRequired(true)),        
        
        async execute(interaction) {
            const userId = interaction.user.id;
            const nombreMoneda = interaction.options.getString('nombre');


            try {
                await crearMoneda(userId, nombreMoneda);
                await interaction.reply(`Se ha creado **${nombreMoneda}** .`);
            } catch (error) {
                console.error("Error creando moneda:", error);
                await interaction.reply("Hubo un error al crear la moneda. Intenta nuevamente.");
            }
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('ver_moneda')
            .setDescription('Ver la cantidad de monedas de un usuario.')
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription('El nombre de la moneda')
                    .setRequired(true)),
        
        async execute(interaction) {
            const userId = interaction.user.id;
            const nombreMoneda = interaction.options.getString('nombre');
    
            try {
                const cantidad = await getMoneda(userId, nombreMoneda);
    
                const embed = new EmbedBuilder()
                    .setColor('#FFD700')  // Color dorado, similar al de una moneda
                    .setTitle(`💰 Dinero del jugador`)
                    .setDescription(`Tenés **${cantidad}** monedas de **${nombreMoneda}**.`)
                    .setTimestamp();
    
                if (cantidad !== null) {
                    await interaction.reply({ embeds: [embed] });
                } else {
                    embed.setDescription(`No tenés monedas de **${nombreMoneda}**.`);
                    await interaction.reply({ embeds: [embed], ephemeral: true  });
                }
            } catch (error) {
                console.error("Error al obtener la moneda:", error);
                await interaction.reply("Hubo un error al obtener la cantidad de monedas. Intenta nuevamente.");
            }
        }
    }
        
];

module.exports = comandosMoneda;


