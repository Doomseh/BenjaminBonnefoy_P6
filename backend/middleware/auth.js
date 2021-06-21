const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupération du token et fonction split pour recupérer uniquement le token sans "Bearer"
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Fonction verify pour décoder le token
        const userId = decodedToken.userId; // Récupération de l'ID utilisateur du token
        if (req.body.userId && req.body.userId !== userId) { // Comparaison de l'ID utilisateur à celui récupérer du token
            throw 'Invalid user ID'; 
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};