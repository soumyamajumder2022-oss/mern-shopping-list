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
app.use(cors({
  origin: true,
  credentials: true
}));

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

// IMPORTANT: API routes must be defined BEFORE static file serving
app.use('/api/items', items);

// Health check route for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running', 
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
    });
});

// Add a simple test route
app.get('/test', (req, res) => {
    res.status(200).json({ 
        message: 'Test route is working',
        timestamp: new Date().toISOString()
    });
});

// Add a root route for testing
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
    
    // Add logging for static file serving
    // IMPORTANT: This must come AFTER API routes but BEFORE the catch-all route
    app.use((req, res, next) => {
        console.log(`Static file request: ${req.method} ${req.url}`);
        next();
    });
    
    // Serve the React app for any route - This should be the LAST route
    app.get('*', (req, res) => {
        console.log(`Sending index.html for route: ${req.url}`);
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => console.log(`Server started on port ${port}`));