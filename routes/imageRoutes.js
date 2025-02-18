const express = require('express');
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image');
const router = express.Router()


// set up storage for uploaded images
// for now we are storing them locally in a folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} - ${file.originalname}`);
    },
});

const upload = multer({storage});

// upload image endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
    try {

        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        const newImage = new Image ({
            filename: req.file.filename,
            url: imageUrl,
        });

        await newImage.save(); // save image metadata in mongodb
        res.status(201).json({url: imageUrl});
    } catch (error) {
        res.status(500).json({message: 'Error uploading image', error});
    }
});

// get image endpoint
router.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    res.sendFile(filePath);
});

module.exports = router;