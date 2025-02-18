const express = require('express');
const connectDB = require('./config/db');
const imageRoutes = require('./routes/imageRoutes');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// connect to mongodb
connectDB();


// ensure uploads directory exists
const uploadsDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// routes
app.use('/api/images', imageRoutes);

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

