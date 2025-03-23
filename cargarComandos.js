const fs = require('fs');
const path = require('path');

const cargarComandos = () => {
    const comandos = [];

    // Ruta donde están guardados los archivos de comandos
    const comandosPath = path.join(__dirname, 'comandos');

    // Leer todos los archivos en la carpeta de comandos
    const files = fs.readdirSync(comandosPath);

    // Filtrar los archivos que terminan en '.js' y cargar su contenido
    files.forEach(file => {
        const filePath = path.join(comandosPath, file);
        if (file.endsWith('.js')) {
            const comando = require(filePath);
            if (Array.isArray(comando)) {
                comandos.push(...comando);  // Si es un array de comandos
            } else {
                comandos.push(comando);  // Si es un único comando
            }
        }
    });

    return comandos;
};

module.exports = { cargarComandos };