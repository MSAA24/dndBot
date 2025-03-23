const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder } = require('discord.js');
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
                    .setRequired(true)
                    .addChoices(
                        { name: 'Acompañante', value: 'acompanante' },
                        { name: 'Dhamphiro', value: 'dhamphiro' },
                        { name: 'Draconido', value: 'draconido' },
                        { name: 'Draconido Cromatico', value: 'draconido_cromatico' },
                        { name: 'Draconido Gema', value: 'draconido_gema' },
                        { name: 'Draconido Metalico', value: 'draconido_metalico' },
                        { name: 'Elfo', value: 'elfo' },
                        { name: 'Enano', value: 'enano' },
                        { name: 'Gnomo', value: 'gnomo' },
                        { name: 'Humano', value: 'humano' },
                        { name: 'Linaje Personalizado', value: 'linaje_personalizado' },
                        { name: 'Mediano', value: 'mediano' },
                        { name: 'Renacido', value: 'renacido' },
                        { name: 'Sangre Malefica', value: 'sangre_malefica' },
                        { name: 'Semielfo', value: 'semielfo' },
                        { name: 'Semiorco', value: 'semiorco' },
                        { name: 'Tiefling', value: 'tiefling' },
                        { name: 'Tiefling Variante', value: 'tiefling_variante' }
                      ))
            .addStringOption(option => 
                option.setName('clase')
                    .setDescription('Clase del personaje')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Artifice', value: 'artifice' },
                        { name: 'Bárbaro', value: 'barbaro' },
                        { name: 'Bardo', value: 'bardo' },
                        { name: 'Clérigo', value: 'clerigo' },
                        { name: 'Druida', value: 'druida' },
                        { name: 'Guerrero', value: 'guerrero' },
                        { name: 'Hechicero', value: 'hechicero' },
                        { name: 'Mago', value: 'mago' },
                        { name: 'Monje', value: 'monje' },
                        { name: 'Paladín', value: 'paladin' },
                        { name: 'Pícaro', value: 'picaro' },
                        { name: 'Explorador', value: 'explorador' }
                      ))
            .addIntegerOption(option => 
                option.setName('nivel')
                    .setDescription('Nivel del personaje')
                    .setRequired(true))
            .addStringOption(option => 
                option.setName('rango')
                    .setDescription('Rango del personaje')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Rango E', value: 'Rango E' },
                        { name: 'Rango D', value: 'Rango D' },
                        { name: 'Rango C', value: 'Rango C' },
                        { name: 'Rango B', value: 'Rango B' },
                        { name: 'Rango A', value: 'Rango A' }
                      ))
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
                    /*
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
                    */
                    const embed = new EmbedBuilder()
                    .setTitle("Personaje")
                    //.setDescription(`El Personaje es: **${personaje.characterName}**`)
                    .setColor('#1E90FF')
                    .addFields(
                        { name: 'Nombre', value: personaje.characterName, inline: true },
                        { name: 'Raza', value: personaje.race, inline: true },
                        { name: 'Clase', value: personaje.class, inline: true },
                        { name: 'Nivel', value: `${personaje.level}`, inline: true },
                        { name: 'Rango', value: personaje.rank, inline: true },
                    )
                    embed.setImage(personaje.imageUrl) 
                    .setTimestamp(); 

                    if (personaje.n20Url) {
                        embed.addFields({
                            name: 'n20',
                            value: `[Ver en n20](${personaje.n20Url})`,
                            inline: false
                        });
                    }

                    await interaction.reply({ embeds: [embed] });
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