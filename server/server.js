const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const items = require('./routes/api/items');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

// CORS Middleware
app.use(cors());

// DB Config
const db = require('./config/keys').mongoURI;

// console.log('Attempting to connect to MongoDB with URI:', db);

// Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB Connected successfully');
        
        // Test the connection by counting items
        const Item = require('./models/Item');
        Item.countDocuments()
            .then(count => console.log(`Found ${count} items in the database`))
            .catch(err => console.log('Error counting items:', err));
    })
    .catch(err => {
        console.log('MongoDB Connection Error:', err);
    });

// Use Routes
app.use('/api/items', items);

// Health check route for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
    
    // Serve the React app for any route
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));