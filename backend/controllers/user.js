const bcrypt = require('bcrypt'); // Plugin pour crypter une chaine de caractère
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Plugin pour génerer un token d'authentification
// Regex avec condition pour sécuriser le mot de passe
const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/ 
// Module pour masquer des données
const MaskData = require("maskdata");
// Option de masquage de l'email
const emailMask2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
};
require('dotenv').config();
// Fonction pour créer un nouvel utilisation
exports.signup = (req, res, next) => {

    // On défini l'email protégé
    const email = req.body.email;
    const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);

    // Condition pour vérifier la qualité du mot de passe
    if (regexPassword.test(req.body.password)) {
    
        bcrypt.hash(req.body.password, 10) // Appel de la fonction de hachage pour le mot de passe puis on lui demandons de « saler » le mot de passe 10 fois.
            .then(hash => {
                const user = new User({
                    email: maskedEmail,
                    password: hash
                });
                user.save() // Sauvegarde des informations du nouvel utilisateur
                    .then(() => res.status(201).json({
                        message: 'Utilisateur créé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            })
            .catch(error => res.status(500).json({
                error
            }));
    } else {

        res.statusMessage = ('Votre mot de passe doit comprendre entre 8 et 15 caractères et contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial')
        res.status(400).end()
    }
};

// Fonction pour se connecter si l'utilisateur est déjà inscrit
exports.login = (req, res, next) => {

    // On récupère l'email protégé
    const email = req.body.email;
    const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);

    User.findOne({
            email: maskedEmail // Recherche de l'utilisateur par son adresse mail
        })
        .then(user => {
            if (!user) { // condition si l'utilisateur n'existe pas
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            // Utilisation fonction compare pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
            bcrypt.compare(req.body.password, user.password) 
                .then(valid => {
                    if (!valid) { // condition si les mots de passe de correspondent pas
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ // fonction sign de jsonwebtoken pour encoder un nouveau token 
                                userId: user._id
                            },
                            process.env.TOKEN, {
                                expiresIn: '24h' // temps de validité du token de 24h
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};