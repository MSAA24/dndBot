const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

//Guardar usuario 
async function saveUser(userID, username) {
    try {
        const command = new PutCommand({
            TableName: "Users", // Asegúrate de que sea el nombre correcto
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