const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.thing);
    delete sauceObject._id;
    const sauce = new Thing({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.getOneThing = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
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

exports.modifyThing = (req, res, next) => {
    const sauce = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    Sauce.updateOne({
        _id: req.params.id
    }, sauce).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteThing = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
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

exports.getAllStuff = (req, res, next) => {
    Sauce.find().then(
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