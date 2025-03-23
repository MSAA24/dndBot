const fs = require('fs');
const path = require('path');

function cargarComandos() {
    const comandos = [];
    const carpetaComandos = path.join(__dirname);
    const archivos = fs.readdirSync(carpetaComandos);

    for (const archivo of archivos) {
        const comando = require(path.join(carpetaComandos, archivo));
        if (Array.isArray(comando)) {
            // Si el módulo exporta un array, agregamos todos los elementos
            comandos.push(...comando);
        } else {
            // Si es un solo comando, lo agregamos directamente
            comandos.push(comando);
        }
    }

    return comandos;
}

module.exports = { cargarComandos };
