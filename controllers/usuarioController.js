const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

// Crear cliente de DynamoDB
const client = new DynamoDBClient({ region: "us-east-2" }); // Cambia la región según corresponda
const dynamoDB = DynamoDBDocumentClient.from(client);

// Función para guardar un usuario en DynamoDB
async function saveUser(userID, username, joinedAt) {
    try {
        const registeredAt = new Date().toISOString()
        const command = new PutCommand({
            TableName: "Users", // Reemplaza con el nombre real de tu tabla
            Item: {
                userID: userID,
                username: username,
                joinedAt: registeredAt
            }
        });

        await dynamoDB.send(command);
        console.log(`✅ Usuario ${username} guardado con éxito`);
    } catch (error) {
        console.error("❌ Error guardando el usuario:", error);
        throw error;
    }
}

async function getUser(userID) {
    const params = {
        TableName: "Users",
        Key: {
            userID: userID
        }
    };

    try {
        // Ejecutamos el comando GetCommand
        const command = new GetCommand(params);
        const result = await dynamoDB.send(command);

        if (result.Item) {
            console.log("Usuario encontrado:", result.Item);
            return result.Item;
        } else {
            console.log("Usuario no encontrado.");
            return null;
        }
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        return null;
    }
}

module.exports = { saveUser, getUser};

