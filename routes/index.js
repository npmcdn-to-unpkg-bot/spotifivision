var express = require('express');
var router = express.Router();

var VisionController = require('../controllers/VisionController');

/* GET home page. */

// CRUD routes
router.get('/:id', VisionController.get);
router.get('/', VisionController.index);
router.post('/', VisionController.create);
router.put('/:id', VisionController.update);
router.delete('/:id', VisionController.destroy);
module.exports = router;
