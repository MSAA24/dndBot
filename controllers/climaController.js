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
        // Consultar si ya existe un clima guardado
        const climaGuardado = await obtenerClimaGlobal();
        
        // Random de 1 a 50
        const numeroAleatorio = Math.floor(Math.random() * 50) + 1;

        // Asignar el clima basado en el número aleatorio
        const climaSeleccionado = climas[numeroAleatorio - 1];

        // Guardar el clima en la base de datos
        await guardarClimaGlobal(climaSeleccionado);

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
        if (result.Item) {
            return result.Item; // Devuelve el clima guardado
        } else {
            console.log('No se encontró clima guardado.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el clima global:', error);
        return null;
    }
}

// Guardar el clima global en la base de datos
async function guardarClimaGlobal(clima) {
    const params = {
        TableName: 'clima',
        Item: {
            climaID: 'global', // ID único para el clima global
            clima: clima
        }
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        console.log('Clima global guardado:', clima);
    } catch (error) {
        console.error('Error al guardar el clima global:', error);
    }
}

module.exports = [
    // Comando /clima
    {
        data: new SlashCommandBuilder()
            .setName('clima')
            .setDescription('Obtiene el clima actual global'),

        async execute(interaction) {
            try {
                const clima = await obtenerClimaGlobal();
                if (clima) {
                    const embed = new EmbedBuilder()
                        .setTitle("🌍 Clima Actual")
                        .setDescription(`El clima actual es: **${clima.clima}**`)
                        .setColor('#1E90FF') // Color
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed] });
                } else {
                    await interaction.reply("No se ha guardado un clima global aún.");
                }
            } catch (error) {
                console.error("Error al mostrar el clima:", error);
                await interaction.reply("Hubo un error al obtener el clima.");
            }
        },
    },

    // Comando /cambiarClima
    {
        data: new SlashCommandBuilder()
            .setName('cambiarclima')
            .setDescription('Cambia el clima global'),

        async execute(interaction) {
            try {
                const clima = await generarYGuardarClima();
                await interaction.reply(`Se cambió el clima a: ${clima}`);
            } catch (error) {
                console.error("Error al cambiar el clima:", error);
                await interaction.reply("Hubo un error al cambiar el clima.");
            }
        },
    },

    // Comando /climaSimple
    {
        data: new SlashCommandBuilder()
            .setName('climasimple')
            .setDescription('Obtiene el clima de forma sencilla'),

        async execute(interaction) {
            try {
                const clima = await obtenerClimaGlobal();
                if (clima) {
                    await interaction.reply(`El clima es: ${clima.clima}`);
                } else {
                    await interaction.reply("No se ha guardado un clima aún.");
                }
            } catch (error) {
                console.error("Error al mostrar el clima simple:", error);
                await interaction.reply("Hubo un error al obtener el clima.");
            }
        },
    },
];