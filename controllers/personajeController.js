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
async function actualizarNivelYRango(characterId, nuevoNivel, nuevoRango) {
    // Verificar que al menos uno de los dos parámetros esté definido
    if (nuevoNivel === undefined && nuevoRango === undefined) {
        console.log("No se proporcionaron valores para actualizar.");
        return;
    }

    // Inicializar la expresión de actualización y valores
    let updateExpression = "set ";
    let expressionAttributeValues = {};
    let updatedAttributes = false;

    // Verificar si se proporciona un nuevo nivel
    if (nuevoNivel !== undefined) {
        updateExpression += "level = :level, ";
        expressionAttributeValues[":level"] = parseInt(nuevoNivel) || 1;
        updatedAttributes = true;
    }

    // Verificar si se proporciona un nuevo rango
    if (nuevoRango !== undefined) {
        updateExpression += "rank = :rank, ";
        expressionAttributeValues[":rank"] = nuevoRango || 'E'; // Por defecto 'E' si no se pasa rango
        updatedAttributes = true;
    }

    if (updatedAttributes) {
        // Eliminar la coma extra al final
        updateExpression = updateExpression.slice(0, -2); // Eliminar la última coma
        updateExpression += ", updatedAt = :updatedAt"; // Agregar la actualización de la fecha

        expressionAttributeValues[":updatedAt"] = new Date().toDateString(); // Fecha de actualización

        // Parámetros de la consulta para DynamoDB
        const params = {
            TableName: "personajes",
            Key: {
                personajeId: characterId // Usar el characterId para buscar el personaje
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW" // Para devolver los nuevos valores después de la actualización
        };

        try {
            const result = await dynamoDB.send(new UpdateCommand(params)); // Ejecutar la actualización en DynamoDB
            console.log("Personaje actualizado:", result.Attributes);
        } catch (error) {
            console.error("Error actualizando personaje:", error);
        }
    } else {
        console.log("No se proporcionaron atributos válidos para actualizar.");
    }
}

    

module.exports = { 
    crearPersonaje, 
    getPersonaje, 
    actualizarPersonaje 
};

