const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder } = require('discord.js');
const {crearMoneda,getMoneda,getMonedas} = require("../controllers/monedaController.js");

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
            .setName('balance')
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
    },

    {
        data: new SlashCommandBuilder()
            .setName('ver_monedas')
            .setDescription('Muestra todas las monedas asociadas a tu cuenta.'),
        
        async execute(interaction) {
            const userId = interaction.user.id; // Obtener el userId del que ejecuta el comando

            try {
                const monedas = await getMonedas(userId); // Obtener las monedas del usuario
                
                if (monedas.length === 0) {
                    return await interaction.reply("No tenés monedas asociadas a tu cuenta.");
                }

                // Crear el Embed para mostrar las monedas
                const embed = new EmbedBuilder()
                    .setColor('#FFD700') // Puedes cambiar el color
                    .setTitle('Tus Monedas')
                    .setDescription('Acá están todas las monedas asociadas a tu cuenta:')

                // Agregar cada moneda al embed
                monedas.forEach(moneda => {
                    embed.addField(moneda.nombre, `Cantidad: ${moneda.cantidad}`, false);
                });

                await interaction.reply({ embeds: [embed], ephemeral: true }); // Responder con el embed

            } catch (error) {
                console.error("Error al mostrar las monedas:", error);
                await interaction.reply("Hubo un error al intentar mostrar las monedas. Intenta nuevamente.");
            }
        }
    }


        
];

module.exports = comandosMoneda;


