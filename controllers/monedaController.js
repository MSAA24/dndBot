const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-2" }); // Cambia la región según corresponda
const dynamoDB = DynamoDBDocumentClient.from(client);


// Crear moneda para un usuario específico
async function crearMoneda(userId, nombreMoneda) {
    //const monedaUserId = `${userId}_${nombreMoneda}`; // Crear un ID único para la moneda de cada usuario

    const params = {
        TableName: "monedas",
        Item: {
            monedaId: userId,
            nombre: nombreMoneda,
            cantidad: 0,
            createdAt: new Date().toDateString()
        }
    };

    try {
        await dynamoDB.send(new PutCommand(params)); // Guardar la moneda en DynamoDB
        console.log(`Moneda ${nombreMoneda} guardada para el usuario ${userId}`);
    } catch (error) {
        console.error("Error guardando moneda:", error);
    }
}


// Obtener la cantidad de una moneda para un usuario
async function getMoneda(userId, nombreMoneda) {
    const monedaUserId = `${userId}_${nombreMoneda}`; // ID único de la moneda

    const params = {
        TableName: "monedas",
        Key: {
            monedaId: userId // Buscar por el ID de la moneda
        }
    };

    try {
        const result = await dynamoDB.send(new GetCommand(params));
        if (result.Item) {
            return result.Item.cantidad; // Devuelve la cantidad de monedas
        } else {
            return 0; // Si no existe la moneda, devuelve 0
        }
    } catch (error) {
        console.error("Error obteniendo monedas:", error);
        return 0; // En caso de error, también devolvemos 0
    }
}

// Actualizar la cantidad de una moneda para un usuario
async function actualizarMoneda(userId, nombreMoneda, cantidad) {
    const monedaUserId = `${userId}_${nombreMoneda}`; // ID único de la moneda

    const params = {
        TableName: "monedas",
        Key: {
            monedaId: userId // Buscar por el ID de la moneda
        },
        UpdateExpression: "set cantidad = cantidad + :cantidad",
        ExpressionAttributeValues: {
            ":cantidad": cantidad // La cantidad a sumar (o restar)
        },
        ReturnValues: "UPDATED_NEW" // Devuelve los nuevos valores de la moneda
    };

    try {
        const result = await dynamoDB.send(new UpdateCommand(params));
        console.log(`Moneda ${nombreMoneda} actualizada para el usuario ${userId}:`, result.Attributes);
    } catch (error) {
        console.error("Error actualizando moneda:", error);
    }
}

// Borrar una moneda de un usuario
async function borrarMoneda(userId, nombreMoneda) {
    const monedaUserId = `${userId}_${nombreMoneda}`;

    const params = {
        TableName: "monedas",
        Key: {
            monedaId: monedaUserId
        }
    };

    try {
        await dynamoDB.send(new DeleteCommand(params)); // Eliminar la moneda
        console.log(`Moneda ${nombreMoneda} borrada para el usuario ${userId}`);
    } catch (error) {
        console.error("Error borrando moneda:", error);
    }
}

    

module.exports = { 
    crearMoneda, 
    getMoneda, 
    actualizarMoneda,
    borrarMoneda
};
