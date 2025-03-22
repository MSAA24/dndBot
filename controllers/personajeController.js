const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-2" }); // Cambia la región según corresponda
const dynamoDB = DynamoDBDocumentClient.from(client);
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
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
            imageUrl: imageUrl || null,
            n20Url: n20Url || null,
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
    actualizarPersonaje  
};

