const express = require("express");
const {
	getPlasmas,
	getPlasma,
	addPlasma,
	acquirePlasma
} = require('../controllers/plasmas');

const Plasma = require('../models/Plasma');
const advancedResults = require('../middleware/advancedResults');
const {
	protect,
	authorize
} = require('../middleware/auth');

const router = express.Router({
	mergeParams: true
});

router
	.route('/')
	.get(getPlasmas)
	.post(addPlasma);

router
	.post('/acquire', acquirePlasma)
// .put(protect, updatePlasma)
// .delete(protect, deletePlasma);

module.exports = router;