require('dotenv').config();
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { fromIni } = require("@aws-sdk/credential-provider-ini");
async function crearPersonaje(userID, nombre, nivel) {
    // Configurar el cliente de DynamoDB
    const client = new DynamoDBClient({
        region: 'us-east-2', // Coloca aquí la región correcta
        /*
        credentials: {
            credentials: fromIni()
        }
        */
    });

    // Crear el objeto del personaje, asignamos 'userID' como la clave primaria.
    const personaje = {
        id: userID,  // usamos userID como su valor
        nombre: nombre,
        nivel: nivel,
        fechaCreacion: new Date().toISOString()
    };

    // Parámetros para DynamoDB
    const params = {
        TableName: 'Personajes', // Asegúrate de que la tabla esté configurada correctamente en DynamoDB
        Item: marshall(personaje)
    };

    try {
        // Insertar el personaje en la tabla
        await client.send(new PutItemCommand(params));
        console.log('Personaje creado exitosamente');
    } catch (error) {
        console.error('Error creando el personaje:', error);
    }
}

// Llamada a la función para probarla
const [userID, nombre, nivel] = process.argv.slice(2); // Obtener parámetros desde la línea de comandos
if (!userID || !nombre || !nivel) {
    console.error('Faltan parámetros. Usa: node testCrearPersonaje.js <userID> <nombre> <nivel>');
} else {
    crearPersonaje(userID, nombre, parseInt(nivel)).catch(console.error);
}