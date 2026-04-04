const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directoryPath = 'C:\\Users\\chann\\Creadorflims\\creadorweb\\public';

// Leemos el directorio
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('No se pudo escanear el directorio: ' + err);
    }

    // Filtramos solo archivos jpg y jpeg
    const imageFiles = files.filter(file =>
        file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
    );

    if (imageFiles.length === 0) {
        console.log('No se encontraron archivos JPG o JPEG.');
        return;
    }

    console.log(`Iniciando conversión de ${imageFiles.length} imágenes...`);

    imageFiles.forEach(file => {
        const inputPath = path.join(directoryPath, file);
        // Cambiamos la extensión a .avif
        const outputPath = path.join(directoryPath, path.parse(file).name + '.avif');

        sharp(inputPath)
            .toFormat('avif', { quality: 50 }) // Puedes ajustar la calidad de 0 a 100
            .toFile(outputPath)
            .then(() => {
                console.log(`✅ Convertida: ${file} -> ${path.parse(file).name}.avif`);
            })
            .catch(err => {
                console.error(`❌ Error convirtiendo ${file}:`, err);
            });
    });
});
