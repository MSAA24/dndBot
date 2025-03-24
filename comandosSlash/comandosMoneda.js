const { SlashCommandBuilder } = require('@discordjs/builders');
const {crearMoneda,getMoneda} = require("../controllers/monedaController.js");

const comandosMoneda = [
    
        {
            data: new SlashCommandBuilder()
                .setName('moneda')
                .setDescription('Gestiona las monedas de los usuarios.')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('crear')
                        .setDescription('Crea una moneda para un usuario.')
                        .addStringOption(option =>
                            option.setName('nombre')
                                .setDescription('El nombre de la moneda')
                                .setRequired(true))
                        .addIntegerOption(option =>
                            option.setName('cantidad')
                                .setDescription('Cantidad de monedas')
                                .setRequired(false)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('ver')
                        .setDescription('Ver la cantidad de monedas de un usuario.')
                        .addStringOption(option =>
                            option.setName('nombre')
                                .setDescription('El nombre de la moneda')
                                .setRequired(true))),
        
            async execute(interaction) {
                const userId = interaction.user.id;
                const monedaUser= `${userId}_${nombreMoneda}`
                const subcommand = interaction.options.getSubcommand();
        
                if (subcommand === 'crear') {
                    const nombreMoneda = interaction.options.getString('nombre');
                    const cantidadMonedas = interaction.options.getInteger('cantidad') || 1;
        
                    await crearMoneda(monedaUser, nombreMoneda, cantidadMonedas);
                    await interaction.reply(`Se ha creado la moneda **${nombreMoneda}** con ${cantidadMonedas} monedas para ti.`);
        
                } else if (subcommand === 'ver') {
                    const nombreMoneda = interaction.options.getString('nombre');
                    const cantidad = await getMoneda(monedaUser, nombreMoneda);
                    await interaction.reply(`Tienes ${cantidad} monedas de **${nombreMoneda}**.`);
                }
            }
        }
];

module.exports = comandosMoneda;


