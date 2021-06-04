const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Plasma = require('../models/Plasma');
const Point = require('../models/Point');

// @desc    Get plasmas
// @route   GET /api/v1/plasmas
// @route   GET /api/v1/points/:pointId/plasmas
// @access  Public
exports.getPlasmas = asyncHandler(async function (req, res, next) {
	if (req.params.pointId) {
		const plasmas = await Plasma.find({
			point: req.params.pointId
		});

		var amounts = {
			A_pos: 0,
			A_neg: 0,
			B_pos: 0,
			B_neg: 0,
			AB_pos: 0,
			AB_neg: 0,
			O_pos: 0,
			O_neg: 0,
		}

		plasmas.forEach(record => {
			switch (record.bloodGroup) {
				case 'A+':
					amounts.A_pos = amounts.A_pos + record.amount;
					break;
				case 'A-':
					amounts.A_neg = amounts.A_neg + record.amount;
					break
				case 'B+':
					amounts.B_pos = amounts.B_pos + record.amount;
					break;
				case 'B-':
					amounts.B_neg = amounts.B_neg + record.amount;
					break;
				case 'AB+':
					amounts.AB_pos = amounts.AB_pos + record.amount;
					break;
				case 'AB-':
					amounts.AB_neg = amounts.AB_neg + record.amount;
					break;
				case 'O+':
					amounts.O_pos = amounts.O_pos + record.amount;
					break;
				case 'O-':
					amounts.O_neg = amounts.O_neg + record.amount;
					break;
				default:
					console.log(record);
					break;

			}
		})
		return res.status(200).render('plasma', {
			success: true,
			count: amounts.length,
			data: amounts,
			pointId: req.params.pointId
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc    Get single plasma
// @route   GET /api/v1/plasmas/:id
// @access  Public
exports.getPlasma = asyncHandler(async function (req, res, next) {
	const plasma = await Plasma.findById(req.params.id).populate({
		path: 'plasma',
		select: 'name description'
	});

	if (!plasma) {
		return next(new ErrorResponse(`No plasma with the id of ${req.params.id}`), 404);
	}
	res.status(200).json({
		success: true,
		data: plasma
	});
});

// @desc    Add plasma
// @route   POST /api/v1/points/:pointId/plasmas
// @access  Private
exports.addPlasma = asyncHandler(async function (req, res, next) {
	req.body.point = req.params.pointId;
	console.log(req.body);

	const point = await Point.findById(req.params.pointId);

	if (!point) {
		return next(new ErrorResponse(`No donation point with the id of ${req.params.pointId}`), 404);
	}

	const plasma = await Plasma.create(req.body);

	res.status(200).redirect(`/points/${req.params.pointId}/plasmas`);
});


exports.acquirePlasma = asyncHandler(async function (req, res, next) {
	req.body.point = req.params.pointId;
	req.body.amount = Number(req.body.amount) * -1;
	console.log(typeof req.body.amount);


	const point = await Point.findById(req.params.pointId);

	const plasmas = await Plasma.find({
		point: req.params.pointId,
		bloodGroup: req.body.bloodGroup
	});


	var availableAmount = 0;

	plasmas.forEach(record => {
		availableAmount += record.amount
	})



	if (!point) {
		return next(new ErrorResponse(`No donation point with the id of ${req.params.pointId}`), 404);
	}

	if (-req.body.amount > availableAmount) {
		console.log(req.body.amount * -1)
		return next(new ErrorResponse(`The available amount of ${req.body.bloodGroup} blood group is less than the required amount`), 400);
	} else {
		const plasma = await Plasma.create(req.body);
	}


	res.status(200).redirect(`/points/${req.params.pointId}/plasmas`);

});