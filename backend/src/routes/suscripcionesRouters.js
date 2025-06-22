const express = require('express');
const router = express.Router();
const { crearSuscripcion } = require('../controllers/suscripcionController');

router.post('/', crearSuscripcion);

module.exports = router;
