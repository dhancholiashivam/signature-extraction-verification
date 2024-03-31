const express = require('express');
const multer = require('multer');
const path = require('path')
const uploadController = require('../controllers/uploadController');

const router = express.Router();
const storage = multer.diskStorage({ 
    destination:(req,res,cb)=>{cb(null, 'public/temp') },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        console.log("file",file);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
    
});

const upload = multer({ storage: storage });

// API endpoint to upload an image and process it with Textract
router.post('/api/extract-data', upload.single('image'), uploadController.extractData);
router.post('/api/extract-signature', upload.single('image'), uploadController.extractSign);

module.exports = router;
