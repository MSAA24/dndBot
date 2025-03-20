require('dotenv').config();
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
console.log(process.env.AWS_ACCESS_KEY_ID);  // Esto debería mostrar tu AWS Access Key
console.log(process.env.AWS_SECRET_ACCESS_KEY);  // Esto debería mostrar tu AWS Secret Key
async function crearPersonaje(userID, nombre, nivel) {
    // Configurar el cliente de DynamoDB
    const client = new DynamoDBClient({
        region: 'us-east-2', // Coloca aquí la región correcta
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    // Crear el objeto del personaje, aquí asignamos 'userID' como la clave primaria.
    const personaje = {
        id: userID,  // La clave primaria es '255', y usamos userID como su valor
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