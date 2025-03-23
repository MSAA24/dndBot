const fs = require('fs');
const path = require('path');

function cargarComandosSlash() {
    const comandos = [];
    const comandosDir = path.join(__dirname, 'comandosSlash'); // Verifica que este directorio exista y contenga archivos de comandos

    fs.readdirSync(comandosDir).forEach((archivo) => {
        const filePath = path.join(comandosDir, archivo);
        const modulo = require(filePath);

        if (Array.isArray(modulo)) {
            modulo.forEach(cmd => {
                if (cmd.data && cmd.data instanceof SlashCommandBuilder) {
                    comandos.push(cmd.data.toJSON());  // Convertimos cada comando a JSON
                } else {
                    console.warn(`⚠️ El archivo ${archivo} no contiene comandos válidos.`);
                }
            });
        } else {
            console.warn(`⚠️ El archivo ${archivo} no exporta un array de comandos.`);
        }
    });

    return comandos;
}

module.exports = { cargarComandosSlash };