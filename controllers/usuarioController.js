const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Crear cliente de DynamoDB
const client = new DynamoDBClient({ region: "us-east-2" }); // Cambia la región según corresponda
const dynamoDB = DynamoDBDocumentClient.from(client);

// Función para guardar un usuario en DynamoDB
async function saveUser(userID, username) {
    try {
        const command = new PutCommand({
            TableName: "Users", // Reemplaza con el nombre real de tu tabla
            Item: {
                userID: userID,
                username: username
            }
        });

        await dynamoDB.send(command);
        console.log(`✅ Usuario ${username} guardado con éxito`);
    } catch (error) {
        console.error("❌ Error guardando el usuario:", error);
        throw error;
    }
}

//Obtener usuario por ID
async function getUser(userID) {
    const params = {
        TableName: "Users",
        Key: {
            userID: userID
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        console.log("Usuario encontrado:", result.Item);
        return result.Item;
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        return null;
    }
}

module.exports = { saveUser, getUser};