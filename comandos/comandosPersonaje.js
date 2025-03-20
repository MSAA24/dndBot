const { crearPersonaje , getPersonaje } = require("../controllers/personajeController.js");
const { updateCharacter } = require("../controllers/personajeController.js");


//Comando para crear Personaje
module.exports = {
    name: "crearpersonaje",
    description: "Crea un personaje en el juego",
    async execute(message, args) {
        const userID = message.author.id;
        const characterName = args[0]; // El primer argumento es el nombre del personaje
        const level = args[1] || 1; // Si no se especifica, por defecto el nivel es 1

        if (!characterName) {
            return message.reply("¡Por favor, ingresa un nombre para tu personaje!");
        }

        try {
            await crearPersonaje(userID, characterName, level);
            message.reply(`¡Tu personaje ${characterName} ha sido creado con éxito y está en nivel ${level}!`);
        } catch (error) {
            message.reply("Hubo un error al crear tu personaje.");
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
            const character = await getCharacter(userID, characterName);
            
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