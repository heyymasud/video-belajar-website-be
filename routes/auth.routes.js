const router = require('express').Router();
const {AuthController} = require('../controllers');

router.get('/user', AuthController.getAllUser);
router.get('/user/:id', AuthController.getUserById);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verifikasi-email/:token', AuthController.verifyEmail);

module.exports = router;
