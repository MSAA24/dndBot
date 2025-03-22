const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-2" }); // Cambia la región según corresponda
const dynamoDB = DynamoDBDocumentClient.from(client);

// Guardar personaje
async function crearPersonaje(userID, nombrePersonaje, raza, clase, nivel, rango) {
    const params = {
        TableName: "personajes", // Nombre de la tabla
        Item: {
            userID: userID,
            characterId: `${userID}_${nombrePersonaje}`, // Cambié `characterID` a `personajeId` para coincidir con la clave primaria de la tabla
            characterName: nombrePersonaje,
            race: raza,
            class: clase,
            level: parseInt(nivel)|| '1',
            rank: rango || 'E',
            imageUrl: character.imageUrl || null,
            n20Url: character.n20Url || null,
            createdAt: new Date().toDateString() // Fecha de creación
        }
    };

    try {
        // Usar el comando PutCommand para guardar el personaje
        await dynamoDB.send(new PutCommand(params));
        console.log("Personaje guardado");
    } catch (error) {
        console.error("Error guardando personaje:", error);
    }
}

// Obtener personaje por ID de usuario
async function getPersonaje(userID) {
    const params = {
        TableName: "personajes",
        Key: {
            userID: userID
        }
    };

    try {
        const result = await dynamoDB.send(new GetCommand(params));
        if (result.Item) {
            console.log("Personaje encontrado:", result.Item);
            return result.Item;
        } else {
            console.log("Personaje no encontrado");
            return null;
        }
    } catch (error) {
        console.error("Error obteniendo personaje:", error);
        return null;
    }
}

// Actualizar solo el nombre o el nivel del personaje
async function actualizarPersonaje(userID, nombreActual, nuevoNombre, nuevoNivel) {
    const params = {
        TableName: "personajes",
        Key: {
            userID: userID,
            personajeId: `${userID}_${nombreActual}` // Cambié `characterID` a `personajeId`
        },
        UpdateExpression: "set #name = :newName, #level = :newLevel",
        ExpressionAttributeNames: {
            "#name": "characterName",
            "#level": "level"
        },
        ExpressionAttributeValues: {
            ":newName": nuevoNombre,
            ":newLevel": nuevoNivel
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const result = await dynamoDB.send(new UpdateCommand(params)); // Usar el comando UpdateCommand para la actualización
        console.log("Personaje actualizado:", result.Attributes);
        return result.Attributes;
    } catch (error) {
        console.error("Error actualizando personaje:", error);
        return null;
    }
}

module.exports = { 
    crearPersonaje, 
    getPersonaje, 
    actualizarPersonaje,
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