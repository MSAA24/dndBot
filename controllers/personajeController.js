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
async function actualizarPersonaje(userId, nombrePersonaje, raza, clase, nivel, rango, imageUrl, n20Url) {
    const characterId = `${userId}_${nombrePersonaje}`; // Crear el ID único para el personaje

    let updateExpression = "set ";  // Expresión para los atributos a actualizar
    let expressionAttributeValues = {};  // Valores de los atributos para actualizar
    let updatedAttributes = false; // Flag para verificar si algún atributo fue proporcionado para actualizar

    // Si el campo 'raza' es proporcionado, agregar a la expresión de actualización
    if (raza) {
        updateExpression += "race = :race, ";
        expressionAttributeValues[":race"] = raza;
        updatedAttributes = true;
    }
    // Si el campo 'clase' es proporcionado, agregar a la expresión de actualización
    if (clase) {
        updateExpression += "class = :class, ";
        expressionAttributeValues[":class"] = clase;
        updatedAttributes = true;
    }
    // Si el campo 'nivel' es proporcionado, agregar a la expresión de actualización
    if (nivel) {
        updateExpression += "level = :level, ";
        expressionAttributeValues[":level"] = parseInt(nivel) || 1;
        updatedAttributes = true;
    }
    // Si el campo 'rango' es proporcionado, agregar a la expresión de actualización
    if (rango) {
        updateExpression += "rank = :rank, ";
        expressionAttributeValues[":rank"] = rango || 'E';
        updatedAttributes = true;
    }
    // Si el campo 'imageUrl' es proporcionado, agregar a la expresión de actualización
    if (imageUrl) {
        updateExpression += "imageUrl = :imageUrl, ";
        expressionAttributeValues[":imageUrl"] = imageUrl || null;
        updatedAttributes = true;
    }
    // Si el campo 'n20Url' es proporcionado, agregar a la expresión de actualización
    if (n20Url) {
        updateExpression += "n20Url = :n20Url, ";
        expressionAttributeValues[":n20Url"] = n20Url || null;
        updatedAttributes = true;
    }

    // Si al menos un atributo ha sido proporcionado para actualizar
    if (updatedAttributes) {
        // Eliminar la coma extra al final de la expresión
        updateExpression = updateExpression.slice(0, -2);
        // Actualizar la fecha de la última modificación
        updateExpression += ", updatedAt = :updatedAt";
        expressionAttributeValues[":updatedAt"] = new Date().toDateString();

        // Parámetros para la actualización
        const params = {
            TableName: "personajes",
            Key: {
                personajeId: characterId  // Usar el personajeId como clave primaria
            },
            UpdateExpression: updateExpression, // Expresión de actualización
            ExpressionAttributeValues: expressionAttributeValues, // Valores de los atributos a actualizar
            ReturnValues: "ALL_NEW"  // Devolver los valores nuevos después de la actualización
        };

        try {
            // Enviar la actualización a DynamoDB
            const result = await dynamoDB.send(new UpdateCommand(params));
            console.log("Personaje actualizado:", result.Attributes); // Mostrar los nuevos atributos
        } catch (error) {
            console.error("Error actualizando personaje:", error); // Mostrar el error si ocurre
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

