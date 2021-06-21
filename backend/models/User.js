const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma de création d'un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // Plugin pour s'assurer que deux utilisateurs ne peuvent partager la même adresse e-mail

module.exports = mongoose.model('User', userSchema);