const { SlashCommandBuilder } = require('@discordjs/builders');
const {saveUser, getUser } = require("../controllers/usuarioController.js");
const {AttachmentBuilder, EmbedBuilder } = require('discord.js');

const comandosUsuario = [
    {
        data: new SlashCommandBuilder()
            .setName('mi_usuario')
            .setDescription('Muestra tu usuario'),
        
            async execute(interaction) {
                try {
                    const user = await getUser(interaction.user.id); // Obtener el usuario desde la base de datos
                    if (user) {
                        const avatarURL = interaction.user.avatarURL({ size: 2048, dynamic: true });
                        // Crear el embed con los datos del usuario
                        const embed = new EmbedBuilder()
                            .setTitle(`Perfil de ${user.username}`)
                            .setDescription(`Acá se encuentra tu información.`)
                            .addFields(
                                { name: 'Usuario:', value: user.username, inline: true },
                                { name: 'Unido el:', value: user.joinedAt, inline: true }
                            )
                            .setThumbnail(avatarURL)
                            .setTimestamp()
                            .setColor('#00ff00');
                        
                        interaction.reply({ embeds: [embed], ephemeral: true }); // Enviar el embed como respuesta
                    } else {
                        interaction.reply("No se encuentra tu perfil en la base de datos.");
                    }
                } catch (error) {
                    console.error("Error al obtener el perfil:", error);
                    message.reply("Hubo un error al intentar obtener tu perfil.");
                }
            }     
    },
    {
        data: new SlashCommandBuilder ()
            .setName('registro')
            .setDescription('Registra tu usuario'),
        
        async execute(interaction) {
            await saveUser(interaction.user.id, interaction.user.username);
            interaction.reply("Tu usuario ha sido registrado.");
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('actualizar_personaje')
            .setDescription('Actualiza los detalles de un personaje en la base de datos.')
            .addStringOption(option =>
            option.setName('nombrepersonaje')
                .setDescription('El nombre del personaje a actualizar.')
                .setRequired(true))
            .addStringOption(option =>
            option.setName('raza')
                .setDescription('La raza del personaje.')
                .setRequired(false))
            .addStringOption(option =>
            option.setName('clase')
                .setDescription('La clase del personaje.')
                .setRequired(false))
            .addIntegerOption(option =>
            option.setName('nivel')
                .setDescription('El nivel del personaje.')
                .setRequired(false))
            .addStringOption(option =>
            option.setName('rango')
                .setDescription('El rango del personaje.')
                .setRequired(false))
            .addStringOption(option =>
            option.setName('imageurl')
                .setDescription('La URL de la imagen del personaje.')
                .setRequired(false))
            .addStringOption(option =>
            option.setName('n20url')
                .setDescription('La URL del personaje en 20 caras.')
                .setRequired(false)),

        async execute(interaction) {
            const userId = interaction.user.id; // Obtener el ID del usuario que está ejecutando el comando
            const nombrePersonaje = interaction.options.getString('nombrepersonaje');
            const raza = interaction.options.getString('raza');
            const clase = interaction.options.getString('clase');
            const nivel = interaction.options.getInteger('nivel');
            const rango = interaction.options.getString('rango');
            const imageUrl = interaction.options.getString('imageurl') || null;
            const n20Url = interaction.options.getString('n20url') || null;

            try {
            // Llamar a la función de actualización de personaje con los datos recibidos
                await actualizarPersonaje(userId, nombrePersonaje, raza, clase, nivel, rango, imageUrl, n20Url);
                await interaction.reply(`✅ Personaje **${nombrePersonaje}** actualizado con éxito.`);
            } catch (error) {
                console.error("Error al actualizar personaje:", error);
                await interaction.reply('❌ Hubo un error al intentar actualizar el personaje.');
            }
        },
    }
    
];

module.exports = comandosUsuario;