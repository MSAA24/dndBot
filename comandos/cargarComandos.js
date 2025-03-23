const fs = require("fs");
const path = require("path");

function cargarComandos() {
    const commands = [];
    const comandosPath = __dirname; // 👈 Asegúrate de que sea solo "comandos"
    
    if (!fs.existsSync(comandosPath)) {
        console.error(`❌ Error: La carpeta ${comandosPath} no existe.`);
        return [];
    }

    const archivosComandos = fs.readdirSync(comandosPath).filter(file => file.endsWith(".js"));

    for (const file of archivosComandos) {
        const command = require(path.join(comandosPath, file));

        if (!command.data) {
            console.warn(`⚠️  Advertencia: ${file} no tiene una propiedad 'data'.`);
            continue;
        }

        commands.push(command);
    }

    console.log("✅ Comandos cargados:", commands.map(cmd => cmd.data.name).join(", "));
    return commands;
}

module.exports = { cargarComandos };