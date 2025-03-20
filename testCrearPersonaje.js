require('dotenv').config();
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { fromIni } = require("@aws-sdk/credential-provider-ini");

const client = new DynamoDBClient({ region: "us-east-2" });
const dynamoDB = DynamoDBDocumentClient.from(client);

async function crearPersonaje(userID, characterName, level) {
    try {
        if (!userID || !characterName || !level) {
            throw new Error("Faltan parámetros: userID, characterName o level");
        }

        const characterData = {
            personajeId: userID, // ✅ Guardamos el ID del usuario de Discord como clave primaria
            characterName: characterName,
            level: parseInt(level)
        };

        console.log("📝 Guardando personaje en DynamoDB:", characterData);

        const command = new PutCommand({
            TableName: "TuTablaDeDynamoDB", // Reemplaza con el nombre real de tu tabla
            Item: characterData
        });

        await dynamoDB.send(command);
        console.log(`✅ Personaje ${characterName} creado para el usuario ${userID}`);
    } catch (error) {
        console.error("❌ Error creando el personaje:", error);
        throw error;
    }
}

module.exports = { crearPersonaje };

// Llamada a la función para probarla
const [userID, nombre, nivel] = process.argv.slice(2); // Obtener parámetros desde la línea de comandos
if (!userID || !nombre || !nivel) {
    console.error('Faltan parámetros. Usa: node testCrearPersonaje.js <userID> <nombre> <nivel>');
} else {
    crearPersonaje(userID, nombre, parseInt(nivel)).catch(console.error);
}