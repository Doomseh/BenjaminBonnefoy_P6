const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.getAllStuff);
router.post('/', auth, multer, saucesCtrl.createThing);
router.get('/:id', auth, saucesCtrl.getOneThing);
router.put('/:id', auth, saucesCtrl.modifyThing);
router.delete('/:id', auth, saucesCtrl.deleteThing);

module.exports = router;