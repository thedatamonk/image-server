const mongoose = require('mongoose');
const connectDB = require('../config/db');

describe('Database Connection', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should connect to MongoDB', async() => {
        const state = mongoose.connection.readyState;
        expect(state).toBe(1);
    });
});