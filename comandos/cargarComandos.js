const fs = require("fs");
const path = require("path");

function cargarComandos() {
    const commands = [];
    const comandosPath = path.join(__dirname, "comandos");
    const archivosComandos = fs.readdirSync(comandosPath).filter(file => file.endsWith(".js"));

    for (const file of archivosComandos) {
        const command = require(path.join(comandosPath, file));

        if (!command.data) {
            console.warn(`⚠️  Advertencia: ${file} no tiene una propiedad 'data'.`);
            continue; // Salta archivos mal definidos
        }

        commands.push(command);
    }

    console.log("✅ Comandos cargados:", commands.map(cmd => cmd.data.name).join(", "));
    return commands;
}

module.exports = { cargarComandos };