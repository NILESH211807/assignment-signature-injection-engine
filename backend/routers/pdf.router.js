const express = require('express');
const router = express.Router();

const pdfController = require('../controllers/pdf.controller');
const { upload } = require('../middlewares/upload');

router.post('/sign-pdf', upload.single('pdfFile'), pdfController.signPdf);

module.exports = router;