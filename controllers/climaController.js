const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Crear cliente de DynamoDB
const client = new DynamoDBClient({ region: "us-east-2" });
const dynamoDB = DynamoDBDocumentClient.from(client);


const climas = [
    "Cielo despejado y brisa suave.",
    "Día soleado con algunas nubes dispersas.",
    "Amanecer fresco, pero el sol calienta rápidamente.",
    "Calor moderado, con el viento refrescando el ambiente.",
    "Un día seco con el cielo azul intenso.",
    "Sol radiante, pero con una ligera neblina matinal.",
    "Temperatura templada con vientos ligeros.",
    "Cielo completamente despejado; ni una nube a la vista.",
    "Día cálido con un aire seco y envolvente.",
    "Ambiente soleado con nubes algodonosas en el horizonte.",

    "Cielo cubierto con una luz grisácea difusa.",
    "Nubes densas, pero sin señales de lluvia.",
    "Un día nublado y algo pesado, sin viento.",
    "Amanecer oscuro con el sol luchando por asomarse.",
    "Día gris con brisa fresca.",
    "Cielo encapotado con ráfagas de viento intermitentes.",
    "Sensación de humedad en el aire, aunque sin lluvia.",
    "Niebla baja cubriendo el suelo por la mañana.",
    "Un cielo plomizo que da una sensación de pesadez.",
    "Atardecer teñido de naranja tras un día mayormente nublado.",

    "Llovizna ligera durante gran parte del día.",
    "Chubascos intermitentes con momentos de calma.",
    "Lluvia constante que humedece todo el paisaje.",
    "Nubes oscuras en el horizonte, anunciando tormenta.",
    "Trueno distante, pero sin lluvia por ahora.",
    "Lluvia suave acompañada de viento fresco.",
    "Tormenta eléctrica en la lejanía, iluminando el cielo.",
    "Un chaparrón inesperado que dura apenas unos minutos.",
    "Bruma húmeda después de una madrugada lluviosa.",
    "Día lluvioso con pequeños charcos por todas partes.",

    "Mañana gélida con escarcha cubriendo el suelo.",
    "Nieve ligera que cae sin acumularse demasiado.",
    "Nubes gruesas y aire helado, pero sin nieve.",
    "Viento cortante que hace difícil mantenerse caliente.",
    "Día frío, pero con sol brillante sobre la nieve.",
    "Un frente de aire frío que desciende repentinamente.",
    "Copos de nieve esporádicos flotando en el aire.",
    "Amanecer helado con cristales de hielo en las hojas.",
    "Una ventisca en la noche dejó el terreno cubierto de blanco.",
    "Cielo despejado, pero el frío es intenso.",

    "Vientos fuertes que levantan polvo y hojas secas.",
    "Brisa errática, a veces suave y otras con ráfagas intensas.",
    "Un aire cálido que se vuelve más frío al anochecer.",
    "Cambio repentino en la temperatura con ráfagas de viento.",
    "Sensación de inestabilidad en el clima; podría cambiar en cualquier momento.",
    "Niebla densa que se disipa con el viento.",
    "Ráfagas de viento ululan entre los árboles, sin lluvia.",
    "Brisa marina refrescante con olor a salitre.",
    "Un día con vientos persistentes que empujan las nubes.",
    "Tormenta de arena leve en regiones áridas, reduciendo la visibilidad."   
];


async function generarYGuardarClima() {
    try {
        const fechaActual = Date.now();
        const veinticuatroHoras = 24 * 60 * 60 * 1000; //24hs

        // Consultar si ya existe un clima guardado
        const climaGuardado = await obtenerClimaGlobal();

        // Si el clima existe y pasaron menos de 24 horas, no se genera clima nuevo
        if (climaGuardado && (fechaActual - climaGuardado.timestamp) < veinticuatroHoras) {
            console.log('El clima sigue siendo el mismo');
            return climaGuardado.clima; //Devuelve el clima guardado
        }

        // random de 1 a 50
        const numeroAleatorio = Math.floor(Math.random() * 50) + 1;

        // Asignar el clima basado en el num random
        const climaSeleccionado = climas[numeroAleatorio - 1]; 

        // Guardar el clima en la base de datos
        await guardarClimaGlobal(climaSeleccionado, fechaActual);

        return climaSeleccionado;
    } catch (error) {
        console.error('Error al generar o guardar el clima global:', error);
    }
}

// Obtener el clima global desde BD
async function obtenerClimaGlobal() {
    const params = {
        TableName: 'clima',  
        Key: { climaID: 'global' } // Usamos un ID único para el clima global
    };
    
    try {
        const result = await dynamoDB.send(new GetCommand(params));
        return result.Item; // Devuelve el clima guardado
    } catch (error) {
        console.error('Error al obtener el clima global:', error);
        return null;
    }
}

// Guardar el clima global en la base de datos
async function guardarClimaGlobal(clima, timestamp) {
    const params = {
        TableName: 'clima',
        Item: {
            climaID: 'global', // ID único para el clima global
            clima: clima,
            timestamp: timestamp
        }
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        console.log('Clima global guardado:', clima);
    } catch (error) {
        console.error('Error al guardar el clima global:', error);
    }
}

module.exports = { obtenerClimaGlobal };