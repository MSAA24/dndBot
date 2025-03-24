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
                    const user = await getUser(interaction.author.id); // Obtener el usuario desde la base de datos
                    if (user) {
                        const avatarURL = interaction.author.avatarURL({ size: 2048, dynamic: true });
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
            await saveUser(interaction.author.id, interaction.author.username);
            interaction.reply("Tu usuario ha sido registrado.");
        }
    }           
];

module.exports = comandosUsuario;