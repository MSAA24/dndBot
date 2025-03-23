const { SlashCommandBuilder } = require('@discordjs/builders');
const { crearPersonaje, getPersonaje } = require('../controllers/personajeController.js');

const comandosPersonaje = [
    {
        data: new SlashCommandBuilder()
            .setName('crear_personaje')
            .setDescription('Crea un personaje en el sistema')
            .addStringOption(option => 
                option.setName('nombre')
                    .setDescription('Nombre del personaje')
                    .setRequired(true))
            .addStringOption(option => 
                option.setName('raza')
                    .setDescription('Raza del personaje')
                    .setRequired(true))
            .addStringOption(option => 
                option.setName('clase')
                    .setDescription('Clase del personaje')
                    .setRequired(true))
            .addIntegerOption(option => 
                option.setName('nivel')
                    .setDescription('Nivel del personaje')
                    .setRequired(true))
            .addStringOption(option => 
                option.setName('rango')
                    .setDescription('Rango del personaje')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('image_url')
                    .setDescription('La imagen del personaje')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('n20_url')
                    .setDescription('El url del personaje')
                    .setRequired(true)),          
        async execute(interaction) {
            const nombre = interaction.options.getString('nombre');
            const raza = interaction.options.getString('raza');
            const clase = interaction.options.getString('clase');
            const nivel = interaction.options.getInteger('nivel');
            const rango = interaction.options.getString('rango');
            const imageUrl = interaction.options.getString('image_url');
            const n20Url = interaction.options.getString('n20_url');
            await crearPersonaje(interaction.user.id, nombre, raza, clase, nivel, rango, imageUrl, n20Url);
            await interaction.reply(`Personaje **${nombre}** creado con éxito!`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('ver_personaje')
            .setDescription('Obtén la información de un personaje por su nombre.')
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription('El nombre del personaje')
                    .setRequired(true)),
        async execute(interaction) {
            const nombrePersonaje = interaction.options.getString('nombre');
            const userID = interaction.user.id;

            try {
                const personaje = await getPersonaje(userID, nombrePersonaje);

                if (personaje) {
                    // Si se encuentra el personaje
                    await interaction.reply(
                        `Información del personaje:
                            \nNombre: ${personaje.characterName}
                            \nRaza: ${personaje.race}
                            \nClase: ${personaje.class}
                            \nNivel: ${personaje.level}
                            \nRango: ${personaje.rank}
                            \nImagen: ${personaje.imageUrl}
                            \n20: ${personaje.n20Url}`);
                    
                } else {
                    // Si no se encuentra el personaje
                    await interaction.reply(`No se encontró un personaje con el nombre **${nombrePersonaje}**.`);
                }
            } catch (error) {
                console.error("Error al obtener personaje:", error);
                await interaction.reply("Hubo un error al intentar obtener el personaje. Intenta nuevamente.");
            }
        },
    }
];

module.exports = comandosPersonaje;