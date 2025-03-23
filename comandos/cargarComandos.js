const fs = require('fs');
const path = require('path');

function cargarComandos() {
    const comandos = [];
    const carpetaComandos = path.join(__dirname);
    const archivos = fs.readdirSync(carpetaComandos);

    for (const archivo of archivos) {
        const comando = require(path.join(carpetaComandos, archivo));
        comandos.push(...comando); // Agregar los comandos de cada archivo
    }

    return comandos;
}

module.exports = { cargarComandos };