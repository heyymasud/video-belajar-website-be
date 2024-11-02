const router = require('express').Router();
const { KelasController } = require('../controllers');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/course', authMiddleware, KelasController.getAllKelas);
router.get('/course/:id', authMiddleware, KelasController.getKelasById);
router.post('/course', authMiddleware, upload.single('image'), KelasController.createKelas);
router.put('/course/:id', authMiddleware, KelasController.updateKelas);
router.delete('/course/:id', authMiddleware, KelasController.deleteKelas);
router.post('/upload', authMiddleware, upload.single('image'), KelasController.uploadImage);

module.exports = router;
