const express = require('express');
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image');
const router = express.Router()
const amqp = require('amqplib/callback_api');



// set up storage for uploaded images
// for now we are storing them locally in a folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempuploadsDir = path.join(__dirname, '../temp-uploads');
        cb(null, tempuploadsDir);
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

// asynchronous upload
// Note that the handler function for this endpoint is synchronous
// As the sending of the image-upload event to the queue is synchronous
router.post('/async-upload', upload.single('image'), (req, res) => {
    try {
        // create filepath of the image where it will be uploaded temporarily
        const filePath = path.join(__dirname, '../temp-uploads', req.file.filename);
        const metadata = {
            originalFilename: req.file.originalname,
            uploadTimestamp: Date.now(),
        }

        // publish message to RabbitMQ
        amqp.connect('amqp://localhost', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            // create channel
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                const queue ='imageUploads';
                const message = JSON.stringify({filePath, metadata});
                

                // check if the queue with the give name exists or not
                // if it doesn't exists then it creates one.
                channel.assertQueue(queue, {
                    durable: false
                });
                
                channel.sendToQueue(queue, Buffer.from(message));

                console.log(" [x] Sent '%s'", message);

            });
        });

        res.status(202).json({message: 'Image upload received and is being processed'});
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