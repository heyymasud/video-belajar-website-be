const router = require('express').Router();
const {KelasController} = require('../controllers');

router.get('/course', KelasController.getAllKelas);
router.get('/course/:id', KelasController.getKelasById);
router.post('/course', KelasController.createKelas);
router.put('/course/:id', KelasController.updateKelas);
router.delete('/course/:id', KelasController.deleteKelas);

module.exports = router;
