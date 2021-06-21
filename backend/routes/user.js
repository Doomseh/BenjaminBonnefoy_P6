const express = require('express');
const router = express.Router();

// Récupération du controller user
const userCtrl = require('../controllers/user');

// Déclaration des routes avec le controller
router.post('/signup', userCtrl.signup); // Route pour la création d'un nouvel utilisateur
router.post('/login', userCtrl.login);  // Route pour la connexion d'un utilisateur déjà existant

module.exports = router;