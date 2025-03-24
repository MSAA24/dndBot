const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-2" }); // Cambia la región según corresponda
const dynamoDB = DynamoDBDocumentClient.from(client);
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

// Crear moneda para un usuario específico
async function crearMoneda(userId, nombreMoneda) {
    const monedaUserId = `${userId}_${nombreMoneda}`; // Crear un ID único para la moneda de cada usuario

    const params = {
        TableName: "monedas",
        Item: {
            monedaId: monedaUserId,
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
            monedaId: monedaUserId // Buscar por el ID de la moneda
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
            monedaId: monedaUserId // Buscar por el ID de la moneda
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

async function getMonedas(userId) {
    const params = {
        TableName: "monedas",
        KeyConditionExpression: "starts_with(monedaId, :userId)", // Usar starts_with para buscar todas las monedas asociadas al userId
        ExpressionAttributeValues: {
            ":userId": userId  // El prefijo de monedaId es el userId
        }
    };

    try {
        const result = await dynamoDB.send(new QueryCommand(params)); // Realizar la consulta
        if (result.Items && result.Items.length > 0) {
            return result.Items.map(item => ({
                nombre: item.nombre,
                cantidad: item.cantidad
            }));
        } else {
            return []; // No se encontraron monedas
        }
    } catch (error) {
        console.error("Error obteniendo las monedas:", error);
        throw new Error("No se pudieron obtener las monedas");
    }
}


    

module.exports = { 
    crearMoneda, 
    getMoneda, 
    actualizarMoneda,
    borrarMoneda,
    getMonedas
};
