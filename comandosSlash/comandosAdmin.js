const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder } = require('discord.js');
const {deleteUser } = require("../controllers/usuarioController.js");

const comandosAdmin = [
    {
        data: new SlashCommandBuilder()
            .setName('eliminar_usuario')
            .setDescription('Elimina un usuario por id')
            .addStringOption(option => 
                option.setName('id')
                    .setDescription('ID del usuario')
                    .setRequired(true)),
            async execute(interaction) {
                // Verifica si el usuario tiene el rol "Admin"
                const rolAdmin = interaction.member.roles.cache.find(role => role.name === "Admin");
                if (!rolAdmin) {
                    return interaction.reply("❌ No tienes permiso para usar este comando.");
                }
    
                // Obtiene el ID del usuario a eliminar
                const userID = interaction.options.getString('id');  // Usar interaction.options.getString()

                try {
                    await deleteUser(userID);  // Asegúrate de que deleteUser esté bien implementada
                    interaction.reply(`✅ El usuario con ID **${userID}** ha sido eliminado correctamente.`);
                } catch (error) {
                    console.error("❌ Error al eliminar el usuario:", error);
                    interaction.reply({
                        content: "⚠️ Hubo un error al eliminar el perfil. Verifica que el ID sea correcto.",
                        ephemeral: true
                    });
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

module.exports = comandosAdmin;