require('dotenv').config();
const AWS = require('aws-sdk');

// Configuración de AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamoDB = new AWS.DynamoDB();

// Parámetros de la tabla
const params = {
    TableName: "Users",
    KeySchema: [
        { AttributeName: "userID", KeyType: "HASH" } // Primary key
    ],
    AttributeDefinitions: [
        { AttributeName: "userID", AttributeType: "S" } // S = String
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,  // Capacidad de lectura
        WriteCapacityUnits: 5   // Capacidad de escritura
    }
};

// Crear la tabla
dynamoDB.createTable(params, (err, data) => {
    if (err) {
        console.error("Error al crear la tabla:", err);
    } else {
        console.log("Tabla creada con éxito:", data.TableDescription.TableName);
    }
});