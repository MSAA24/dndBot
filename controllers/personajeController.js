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
            userId: userId,
            personajeId: characterId,
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
async function actualizarPersonaje(characterId, raza, clase, nivel, rango, imageUrl, n20Url) {
    let updateExpression = "set ";
    let expressionAttributeValues = {};
    let updatedAttributes = false; // Flag para verificar si algún atributo fue proporcionado para actualizar

    // Verifica si el campo raza está presente y agrega la condición a la expresión de actualización
    if (raza !== undefined) {
        updateExpression += "race = :race, ";
        expressionAttributeValues[":race"] = raza;
        updatedAttributes = true;
    }
    if (clase !== undefined) {
        updateExpression += "class = :class, ";
        expressionAttributeValues[":class"] = clase;
        updatedAttributes = true;
    }
    if (nivel !== undefined) {
        updateExpression += "level = :level, ";
        expressionAttributeValues[":level"] = parseInt(nivel) || 1;
        updatedAttributes = true;
    }
    if (rango !== undefined) {
        updateExpression += "rank = :rank, ";
        expressionAttributeValues[":rank"] = rango || 'E';
        updatedAttributes = true;
    }
    if (imageUrl !== undefined) {
        updateExpression += "imageUrl = :imageUrl, ";
        expressionAttributeValues[":imageUrl"] = imageUrl || null;
        updatedAttributes = true;
    }
    if (n20Url !== undefined) {
        updateExpression += "n20Url = :n20Url, ";
        expressionAttributeValues[":n20Url"] = n20Url || null;
        updatedAttributes = true;
    }

    // Si al menos un atributo ha sido actualizado
    if (updatedAttributes) {
        // Quitamos la última coma extra
        updateExpression = updateExpression.slice(0, -2);
        updateExpression += ", updatedAt = :updatedAt";
        expressionAttributeValues[":updatedAt"] = new Date().toDateString();

        const params = {
            TableName: "personajes",
            Key: {
                personajeId: characterId // El ID del personaje como clave primaria
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW" // Devuelve los nuevos valores después de la actualización
        };

        try {
            const result = await dynamoDB.send(new UpdateCommand(params)); // Actualizar personaje en DynamoDB
            console.log("Personaje actualizado:", result.Attributes);
        } catch (error) {
            console.error("Error actualizando personaje:", error);
        }
    } else {
        console.log("No se proporcionaron atributos para actualizar.");
    }

}

    

module.exports = { 
    crearPersonaje, 
    getPersonaje, 
    actualizarPersonaje 
};

