const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Recupération des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Connexion à la base de donnée MongoDB
mongoose.connect('mongodb+srv://Benjamin:g1pMHnukxxja3vWQ@cluster0.zcdvw.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// headers pour intéragir avec l'API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accéder à notre API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Envoyer des requêtes avec les méthodes mentionnées 
    next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images'))); // Gestion de l'ajout de photo

// Déclaration des routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;