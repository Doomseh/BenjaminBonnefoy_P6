const express = require('express');
const router = express.Router();

// Récupération du controller des sauces
const saucesCtrl = require('../controllers/sauce'); 

// Récupération des middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Déclaration des différentes routes avec vérification de l'authentification
router.get('/', auth, saucesCtrl.getAllSauces); // Route du renvoie du tableau de toutes les sauces
router.post('/', auth, multer, saucesCtrl.createSauce); // Route de la création d'une sauce avec "multer" pour la gestion de l'image
router.get('/:id', auth, saucesCtrl.getOneSauce); // Route de la récupération d'une sauce par rapport à son ID
router.put('/:id', auth, multer, saucesCtrl.modifySauce); // Route de la modification d'une sauce avec "multer" pour la gestion de l'image
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Route pour la suppréssion d'une sauce
router.post('/:id/like', auth, saucesCtrl.sauceLikeDislike); // Route pour la gestion des likes et dislikes des sauces

module.exports = router;