// Guardar personaje
async function crearPersonaje(userID, nombrePersonaje, nivel) {
    const params = {
        TableName: "Personajes", // Nombre de la tabla, si tienes una diferente, cámbiala
        Item: {
            userID: userID,
            characterID: `${userID}_${nombrePersonaje}`, // Usamos el ID del usuario y el nombre del personaje como ID único
            characterName: nombrePersonaje,
            level: nivel,
            createdAt: new Date().toISOString() // Fecha de creación
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log("Personaje guardado");
    } catch (error) {
        console.error("Error guardando personaje:", error);
    }
}

// Obtener personaje por ID de usuario
async function getPersonaje(userID) {
    const params = {
        TableName: "Personajes", // Nombre de la tabla, si tienes una diferente, cámbiala
        Key: {
            userID: userID
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
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
        TableName: "Personajes",
        Key: {
            userID: userID,
            characterID: `${userID}_${nombreActual}` // Clave compuesta por userID y nombre actual
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
        const result = await dynamoDB.update(params).promise();
        console.log("Personaje actualizado:", result.Attributes);
        return result.Attributes;
    } catch (error) {
        console.error("Error actualizando personaje:", error);
        return null;
    }
}


module.exports = { crearPersonaje, getPersonaje, actualizarPersonaje };