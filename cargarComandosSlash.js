const fs = require('fs');
const path = require('path');

function cargarComandosSlash() {
    const comandos = [];
    const comandosPath = path.join(__dirname, 'comandosSlash'); // Asegúrate de que esta carpeta existe

    if (!fs.existsSync(comandosPath)) {
        console.warn('⚠️ La carpeta comandosSlash no existe.');
        return [];
    }

    const files = fs.readdirSync(comandosPath).filter(file => file.endsWith('.js'));

    files.forEach(file => {
        const filePath = path.join(comandosPath, file);
        const comando = require(filePath);

        if (Array.isArray(comando)) {
            comandos.push(...comando);
        } else {
            console.warn(`⚠️ El archivo ${file} no exporta un arreglo de comandos.`);
        }
    });

    return comandos;
}

module.exports = {cargarComandosSlash};