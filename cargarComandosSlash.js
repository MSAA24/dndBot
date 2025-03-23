const fs = require('fs');
const path = require('path');

const cargarComandosSlash = () => {
    const comandos = [];

    // Ruta donde están guardados los archivos de comandosSlash
    const comandosPath = path.join(__dirname, 'comandosSlash');  // Asegúrate de poner la ruta correcta

    // Leer todos los archivos en la carpeta de comandosSlash
    const files = fs.readdirSync(comandosPath);

    // Filtrar los archivos que terminan en '.js' y cargar su contenido
    files.forEach(file => {
        const filePath = path.join(comandosPath, file);
        if (file.endsWith('.js')) {
            const comandosArchivo = require(filePath);
            if (Array.isArray(comandosArchivo)) {
                comandos.push(...comandosArchivo);  // Agregar todos los comandos exportados
            } else {
                console.warn(`El archivo ${file} no exporta un arreglo de comandos.`);
            }
        }
    });

    return comandos;
};

module.exports = cargarComandosSlash;