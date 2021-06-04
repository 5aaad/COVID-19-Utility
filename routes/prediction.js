const express = require('express');
const {
	renderCovidPrediction,
	postCovidPrediction,
	renderCovidResultPage,
	timeSeries
} = require('../controllers/prediction');


const router = express.Router({
	mergeParams: true
});

router.route('/covid').get(renderCovidPrediction).post(postCovidPrediction);
router.route('/covidoutput').get(renderCovidResultPage);
router.route('/timeseries').get(timeSeries);



module.exports = router;