const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { crearPersonaje , getPersonaje, actualizarPersonaje } = require("../controllers/personajeController.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

//Comando para crear Personaje
/*
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!crearPersonaje")) return; // Verifica que el mensaje empiece con el comando
    if (message.author.bot) return; // Ignora mensajes de otros bots

    const args = message.content.split(" ").slice(1); // Obtiene los argumentos después del comando
    const userID = message.author.id; // ID del usuario de Discord
    const characterName = args[0]; // Nombre del personaje
    const level = args[1] ? parseInt(args[1]) : 1; // Nivel, por defecto 1

    if (!characterName) {
        return message.reply("⚠️ Uso correcto: `!crearPersonaje <nombre> <nivel>`");
    }

    try {
        await crearPersonaje(userID, characterName, level);
        message.reply(`✅ ¡Personaje **${characterName}** creado exitosamente en nivel **${level}**!`);
    } catch (error) {
        console.error("❌ Error al crear personaje:", error);
        message.reply("❌ Hubo un error al crear tu personaje.");
    }
});
*/
const createCharacterCommand = new SlashCommandBuilder()
    .setName("crear-personaje")
    .setDescription("Crea una nueva hoja de personaje")
    .addStringOption(option =>
      option.setName("Nombre")
        .setDescription("Nombre del personaje")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("Nivel")
        .setDescription("Nivel del personaje")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(20))
    .addStringOption(option =>
      option.setName("Clase")
        .setDescription("Clase del personaje")
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
    .addStringOption(option =>
      option.setName("Raza")
        .setDescription("Raza del personaje")
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
      option.setName("Rango")
        .setDescription("Rango del personaje")
        .setRequired(true)
        .addChoices(
          { name: 'Rango E', value: 'Rango E' },
          { name: 'Rango D', value: 'Rango D' },
          { name: 'Rango C', value: 'Rango C' },
          { name: 'Rango B', value: 'Rango B' },
          { name: 'Rango A', value: 'Rango A' }
        ))
    .addStringOption(option =>
      option.setName("Imagen")
        .setDescription("URL de la imagen del personaje")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("n20")
        .setDescription("URL adicional para N20")
        .setRequired(true));


client.on("messageCreate", async (message) => {
    if (message.content.startsWith("!verPersonaje")) {
        const user = await getPersonaje(message.author.id);
        if (user) {
            message.reply(`Hola ${user.username}, te registraste en: ${user.joinedAt}`);
        } else {
            message.reply("No se encuentra tu perfil en la base de datos.");
        }
    }
});

module.exports = {
    data: createCharacterCommand,
    async execute(interaction) {
        const nombrePersonaje = interaction.options.getString('nombre');
        const nivel = interaction.options.getInteger('nivel');
        const clase = interaction.options.getString('clase');
        const raza = interaction.options.getString('raza');
        const rango = interaction.options.getString('rango');
        const imagen = interaction.options.getString('imagen');
        const n20Url = interaction.options.getString('n20');

        // Llama a la función para crear el personaje en DynamoDB
        try {
            await crearPersonaje(
                interaction.user.id, 
                nombrePersonaje, 
                raza, 
                clase, 
                nivel, 
                rango,
                imagen,
                n20Url
            );

            // Responder al usuario que el personaje fue creado
            await interaction.reply(`¡Personaje ${nombrePersonaje} creado con éxito!`);
        } catch (error) {
            console.error('Error al crear el personaje:', error);
            await interaction.reply('Hubo un error al crear el personaje.');
        }
    }
};

console.log(createCharacterCommand.toJSON());

client.login(process.env.TOKEN);
















/*
module.exports = {
    name: "crearpersonaje",
    description: "Crea un personaje en el juego",
    async execute(message, args) {
        const userID = message.author.id; // ✅ ID del usuario de Discord como clave primaria
        const characterName = args[0]; // El primer argumento es el nombre del personaje
        const level = args[1] ? parseInt(args[1]) : 1; // Si no se especifica, el nivel es 1

        if (!characterName) {
            return message.reply("⚠️ ¡Por favor, ingresa un nombre para tu personaje! Uso: `!crearpersonaje <nombre>`");
        }

        try {
            await crearPersonaje(userID, characterName, level);
            message.reply(`✅ ¡Tu personaje **${characterName}** ha sido creado con éxito en nivel **${level}**!`);
        } catch (error) {
            console.error("❌ Error al crear el personaje:", error);
            message.reply("❌ Hubo un error al crear tu personaje.");
        }
    }
};

//Comando para ver Personaje 

module.exports = {
    name: "verpersonaje",
    description: "Muestra la información de tu personaje",
    async execute(message, args) {
        const userID = message.author.id;
        const characterName = args[0]; // Nombre del personaje a buscar

        if (!characterName) {
            return message.reply("Uso: `!verpersonaje <nombre del personaje>`");
        }

        try {
            const character = await getPersonaje(userID, characterName);
            
            if (character) {
                message.reply(`📜 **Información de tu personaje**:
                🔹 **Nombre**: ${character.characterName}
                🔹 **Nivel**: ${character.level}`);
            } else {
                message.reply("⚠️ No tienes un personaje con ese nombre.");
            }
        } catch (error) {
            message.reply("❌ Hubo un error al obtener la información de tu personaje.");
        }
    }
};

//Comando para Actualizar Personaje
module.exports = {
    name: "actualizarpersonaje",
    description: "Actualiza el nombre y/o nivel de tu personaje",
    async execute(message, args) {
        const userID = message.author.id;
        const currentCharacterName = args[0]; // Nombre actual del personaje
        const newCharacterName = args[1]; // Nuevo nombre del personaje
        const newLevel = args[2]; // Nuevo nivel

        if (!currentCharacterName || !newCharacterName || !newLevel) {
            return message.reply("Uso: `!actualizarpersonaje <nombre actual> <nuevo nombre> <nuevo nivel>`");
        }

        try {
            const updatedCharacter = await updateCharacter(userID, currentCharacterName, newCharacterName, parseInt(newLevel));
            
            if (updatedCharacter) {
                message.reply(`¡Tu personaje ha sido actualizado! Nuevo nombre: **${newCharacterName}**, Nivel: **${newLevel}**`);
            } else {
                message.reply("No se pudo actualizar el personaje. Asegúrate de que existe.");
            }
        } catch (error) {
            message.reply("Hubo un error al actualizar tu personaje.");
        }
    }
};

*/