const express = require('express');
const {
	register,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	updatePassword,
	getUserInfo,
	logout,
	getDoctors,
	patient,
	getDoctor
} = require('../controllers/doctor');

const router = express.Router();
const {
	doctorProtect
} = require('../middleware/doctorAuth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', doctorProtect, getMe);
router.put('/updateDetails', updateDetails);
router.put('/updatePassword', updatePassword);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);
router.get('/getInfo', getUserInfo);
router.get('/logout', logout);
router.get('/getDoctors', getDoctors);
router.get('/get-patients', patient);

router.route('/:id')
	.get(getDoctor)


module.exports = router;