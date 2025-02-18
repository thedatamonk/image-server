// image upload worker that will consume the `image-upload` messages
// from the rabbitmq queue
// and then perform the actual upload


const amqp = require('amqplib/callback_api');
const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const connectDB = require('../config/db');

// connect to mongodb
connectDB();

amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }

    // if connection to rabbitmq was successful, 
    // then create channel
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = 'imageUploads';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async(msg) => {
            if (msg != null) {
                const {filePath, metadata} = JSON.parse(msg.content.toString());

                try {
                    // create paths to the actual uploads directory
                    const uploadsDir = path.join(__dirname, '../uploads');
                    const newFilePath = path.join(uploadsDir, path.basename(filePath));
                    

                    // now move the file from temp path to the actual path
                    fs.renameSync(filePath, newFilePath);

                    // save image metadata to MongoDB
                    const imageUrl = `http://localhost:3000/uploads/${path.basename(newFilePath)}`;
                    const newImage = new Image ({
                        filename: path.basename(newFilePath),
                        url: imageUrl,
                        originalFilename: metadata.originalFilename,
                        uploadTimestamp: metadata.uploadTimestamp,
                    });
            
                    await newImage.save(); // save image metadata in mongodb

                    console.log(" [x] Processed '%s'", msg.content.toString());
                    
                    // acknowledge the message
                    channel.ack(msg);

                } catch (error) {
                    console.error('Error processing message:', error);
                    // Optionally, you can reject the message and requeue it
                    channel.nack(msg);
                }
            }
        }, {
            noAck: false    // this ensures that the worker has to send an explicit acknowledgement to the queue
        });

    });
});
