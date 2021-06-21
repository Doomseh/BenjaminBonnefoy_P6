// Récupération du model de sauce
const Sauce = require('../models/Sauce');
const fs = require('fs');

// Fonction de création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // Récupération du coprs de la requete
    delete sauceObject._id;
    const sauce = new Sauce({ // création d'une nouvel sauce grâce au model de sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Création de l'url de l'image
        usersliked: [],
        usersdisliked: [],
        likes: 0,
        dislikes: 0
    });
    sauce.save() // Sauvegarde des informations
        .then(() => res.status(201).json({
            message: 'Sauce enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Fonction pour récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id // Utilisation de la méthone findOne() pour trouver la sauce correspondant au paramètre de la requête
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// Fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };

    Sauce.updateOne({
            _id: req.params.id // Utilisation de la méthone updateOne() pour modifier la sauce correspondant au paramètre de la requête
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id // Utilisation de la méthone findOne() pour trouver la sauce correspondant au paramètre de la requête
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // Récupération du fichier image de la sauce
            fs.unlink(`images/${filename}`, () => { // Suppréssion de l'image
                Sauce.deleteOne({
                        _id: req.params.id // Utilisation de la méthone deleteOne() pour supprimer la sauce correspondant au paramètre de la requête
                    })
                    .then(() => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

// Fonction pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(  // Utilisation de la méthone find() pour trouver toutes les sauces
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// Fonction de la gestion des likes et dislikes
exports.sauceLikeDislike = (req, res, next) => {
    const userId = req.body.userId;
    const likes = req.body.like;
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            switch (likes) { // Utilisation d'un switch pour les différents cas possible
                case 1: // Like de la sauce
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $push: {
                                usersLiked: userId // Ajout du userID au tableau des usersLiked
                            },
                            $inc: {
                                likes: +1 // Incrémentation de 1 aux nombres de likes
                            }
                        })

                        .then(() => {
                            sauce.save();
                            res.status(200).json({
                                message: 'La sauce à été apprécié'
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }));
                    break;

                case 0: // Suppression du like/disklike
                    if (sauce.usersLiked.includes(userId)) { // Vérification si l'utilisateur a déjà like la sauce
                        Sauce.updateOne({
                                _id: req.params.id
                            }, {
                                $pull: {
                                    usersLiked: userId // Suppression de l'userID du tableau des usersLiked
                                },
                                $inc: {
                                    likes: -1 // Décrémentation de 1 du nombres de likes
                                }
                            })
                            .then(() => {
                                sauce.save();
                                res.status(200).json({
                                    message: 'Like supprimé'
                                })
                            })
                            .catch(error => res.status(400).json({
                                error
                            }));
                    } else if (sauce.usersDisliked.includes(userId)) { // Vérification si l'utilisateur a déjà dislike la sauce
                        Sauce.updateOne({
                                _id: req.params.id
                            }, {
                                $pull: {
                                    usersDisliked: userId // Suppression de l'userID du tableau des usersDisliked
                                },
                                $inc: {
                                    dislikes: -1 // Décrémentation de 1 du nombres de dislikes
                                }
                            })
                            .then(() => {
                                sauce.save();
                                res.status(200).json({
                                    message: 'dislike supprimé'
                                })
                            })
                            .catch(error => res.status(400).json({
                                error
                            }));
                    }
                    break;

                case -1: // Dislike de la sauce
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $push: {
                                usersDisliked: userId // Ajout du userID au tableau des usersDisliked
                            },
                            $inc: {
                                dislikes: +1 // Incrémentation de 1 aux nombres de dislikes
                            }
                        })
                        .then(() => {
                            sauce.save();
                            res.status(200).json({
                                message: "La sauce n'à pas été apprécié"
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }));
                    break;

            }
        })
        .catch(error => res.status(400).json({
            error
        }));
};