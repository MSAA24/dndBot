const fs = require('fs');
const path = require('path');

function cargarComandosSlash() {
    const comandos = [];
    const comandosDir = path.join(__dirname, 'comandos');

    fs.readdirSync(comandosDir).forEach((archivo) => {
        const filePath = path.join(comandosDir, archivo);
        const modulo = require(filePath);

        if (Array.isArray(modulo)) {
            comandos.push(...modulo.map(cmd => cmd.data.toJSON())); // Convertimos cada comando a JSON
        } else {
            console.warn(`⚠️ El archivo ${archivo} no exporta un array de comandos.`);
        }
    });

    return comandos;
}

module.exports = { cargarComandosSlash };
