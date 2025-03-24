const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

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

//Borrar personaje por characterId
async function borrarPersonaje(userID, nombrePersonaje) {
    const characterId = `${userID}_${nombrePersonaje}`;

    const params = {
        TableName: "personajes",
        Key: {
            personajeId: characterId  // Usar el characterId como la clave primaria
        }
    };

    try {
        // Ejecutar el comando para borrar el personaje
        const result = await dynamoDB.send(new DeleteCommand(params)); 

        // Si no ocurre error, devolver el resultado de la eliminación
        console.log("Personaje borrado con éxito");
        return true;
    } catch (error) {
        console.error("Error borrando personaje:", error);
        return false; // Indicar que hubo un error al borrar el personaje
    }
}

// Actualizar personaje (ejemplo de actualización de nivel o nombre, si es necesario)
async function actualizarNivelYRango(characterId, nuevoNivel, nuevoRango) {
    // Validar que el nivel no sea mayor a 20
    if (nuevoNivel && nuevoNivel > 20) {
        nuevoNivel = 20; // Si el nivel es mayor a 20, lo asignamos a 20
    }

    // Si no se pasa nivel, asignamos 1 (o el valor máximo de 20 si el nivel es 0 o negativo)
    nuevoNivel = nuevoNivel || 1;

    const updateExpression = "set #lvl = :lvl, #rnk = :rnk, updatedAt = :updatedAt";
    const expressionAttributeValues = {
        ":lvl": nuevoNivel,
        ":rnk": nuevoRango || 'E', // Si no se pasa un nuevo rango, se usa 'E'
        ":updatedAt": new Date().toDateString(), // Fecha de actualización
    };
    
    // Usar ExpressionAttributeNames para evitar el uso de palabras reservadas
    const expressionAttributeNames = {
        "#lvl": "level",  // Alias para 'level'
        "#rnk": "rank"    // Alias para 'rank'
    };

    const params = {
        TableName: "personajes",
        Key: {
            personajeId: characterId, // Usamos el ID del personaje para buscarlo
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW", // Devuelve los nuevos valores después de la actualización
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
    actualizarNivelYRango,
    borrarPersonaje
};

