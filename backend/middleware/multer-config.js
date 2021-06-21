const multer = require('multer');

// Gestion des extensions des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { // Destination pour l'enregistrement des fichier dans le dossier 'images"
        callback(null, 'images');
    },
    filename: (req, file, callback) => { // Gestion du nom du fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({
    storage: storage
}).single('image');