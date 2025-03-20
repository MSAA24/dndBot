
//Guardar usuario 
async function saveUser(userID, username) {
    const params = {
        TableName: "Users",
        Item: {
            userID: userID,
            username: username,
            joinedAt: new Date().toISOString()
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log("Usuario guardado en DynamoDB");
    } catch (error) {
        console.error("Error guardando usuario:", error);
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
