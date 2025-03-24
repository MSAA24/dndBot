const { SlashCommandBuilder } = require('@discordjs/builders');
const {crearMoneda,getMoneda} = require("../controllers/monedaController.js");

const comandosMoneda = [
    {
        data: new SlashCommandBuilder()
            .setName('crear_moneda')
            .setDescription('Crea una moneda para un usuario.')
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription('El nombre de la moneda')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('cantidad')
                    .setDescription('Cantidad de monedas')
                    .setRequired(false)),
        
        async execute(interaction) {
            const userId = interaction.user.id;
            const characterId = `${userId}_${nombrePersonaje}`;
            const nombreMoneda = interaction.options.getString('nombre');
            const cantidadMonedas = interaction.options.getInteger('cantidad') || 1;

            try {
                await crearMoneda(characterId, nombreMoneda, cantidadMonedas);
                await interaction.reply(`Se ha creado la moneda **${nombreMoneda}** con ${cantidadMonedas} monedas para ti.`);
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
            const characterId = `${userId}_${nombrePersonaje}`;
            const nombreMoneda = interaction.options.getString('nombre');

            try {
                const cantidad = await getMoneda(characterId, nombreMoneda);
                if (cantidad !== null) {
                    await interaction.reply(`Tienes ${cantidad} monedas de **${nombreMoneda}**.`);
                } else {
                    await interaction.reply(`No tienes monedas de **${nombreMoneda}**.`);
                }
            } catch (error) {
                console.error("Error al obtener la moneda:", error);
                await interaction.reply("Hubo un error al obtener la cantidad de monedas. Intenta nuevamente.");
            }
        }
    }
        
];

module.exports = comandosMoneda;


