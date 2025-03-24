const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-2" }); // Cambia la región según corresponda
const dynamoDB = DynamoDBDocumentClient.from(client);

// Guardar personaje
async function crearPersonaje(userId, nombrePersonaje, raza, clase, nivel, rango, imageUrl, n20Url) {
    const characterId = `${userId}_${nombrePersonaje}`; // Crear un ID único para el personaje

    const params = {
        TableName: "personajes",
        Item: {
            personajeId: characterId,
            userId: userId,
            characterName: nombrePersonaje,
            race: raza,
            class: clase,
            level: parseInt(nivel) || 1,
            rank: rango || 'E',
            imageUrl: imageUrl || null,
            n20Url: n20Url || null,
            createdAt: new Date().toDateString()
        }
    };

    try {
        await dynamoDB.send(new PutCommand(params)); // Guardar personaje en DynamoDB
        console.log("Personaje guardado");
    } catch (error) {
        console.error("Error guardando personaje:", error);
    }
}

// Obtener personaje por characterId (userID + nombrePersonaje)
async function getPersonaje(userID, nombrePersonaje) {
    const characterId = `${userID}_${nombrePersonaje}`;

    const params = {
        TableName: "personajes",
        Key: {
            personajeId: characterId  // Usar el characterId como la clave primaria
        }
    };

    try {
        const result = await dynamoDB.send(new GetCommand(params)); // Obtener personaje por characterId
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

// Actualizar personaje (ejemplo de actualización de nivel o nombre, si es necesario)
async function actualizarPersonaje(userId, nombrePersonaje, raza, clase, nivel, rango, imageUrl, n20Url) {
    const characterId = `${userId}_${nombrePersonaje}`; // Crear un ID único para el personaje

    const params = {
        TableName: "personajes",
        Key: {
            personajeId: characterId, // Identificador del personaje para actualizar
            userId: userId
        },
        UpdateExpression: "set characterName = :characterName, race = :race, class = :class, level = :level, rank = :rank, imageUrl = :imageUrl, n20Url = :n20Url, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":characterName": nombrePersonaje,
            ":race": raza,
            ":class": clase,
            ":level": parseInt(nivel) || 1,
            ":rank": rango || 'E',
            ":imageUrl": imageUrl || null,
            ":n20Url": n20Url || null,
            ":updatedAt": new Date().toDateString() // Fecha de la última actualización
        },
        ReturnValues: "ALL_NEW" // Devuelve los nuevos valores después de la actualización
    };

    try {
        const result = await dynamoDB.send(new UpdateCommand(params)); // Actualizar personaje en DynamoDB
        console.log("Personaje actualizado:", result.Attributes);
    } catch (error) {
        console.error("Error actualizando personaje:", error);
    }
}

module.exports = { 
    crearPersonaje, 
    getPersonaje, 
    actualizarPersonaje 
};

