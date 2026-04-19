const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directoryPath = 'C:\\Users\\chann\\Creadorflims\\creadorweb\\public';

// Leemos el directorio
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('No se pudo escanear el directorio: ' + err);
    }

    /**
     * FILTRO OPTIMIZADO:
     * ^studio[3-5] -> El nombre debe empezar exactamente con "studio" seguido de un número del 3 al 5.
     * \.(jpe?g)$   -> Debe terminar en .jpg o .jpeg (la 'e' es opcional por el '?').
     * 'i'          -> Flag para ignorar mayúsculas/minúsculas (Case Insensitive).
     */
    const targetPattern = /^bts\.(jpe?g)$/i;

    const imageFiles = files.filter(file => targetPattern.test(file));

    if (imageFiles.length === 0) {
        console.log('No se encontraron los archivos studio3, studio4 o studio5 con extensión JPG/JPEG.');
        return;
    }

    console.log(`Iniciando conversión de ${imageFiles.length} imágenes seleccionadas...`);

    imageFiles.forEach(file => {
        const inputPath = path.join(directoryPath, file);
        const outputPath = path.join(directoryPath, path.parse(file).name + '.avif');

        sharp(inputPath)
            .toFormat('avif', { quality: 50 })
            .toFile(outputPath)
            .then(() => {
                console.log(`✅ Convertida: ${file} -> ${path.parse(file).name}.avif`);
            })
            .catch(err => {
                console.error(`❌ Error convirtiendo ${file}:`, err);
            });
    });
});
