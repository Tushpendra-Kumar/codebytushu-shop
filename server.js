// server.js - CodeByTushu Backend

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// 1. Static Content Configuration (Zaroori: Yeh files browser tak pahunchayega)
app.use(express.static(path.join(__dirname, 'pages'))); 
app.use('/src', express.static(path.join(__dirname, 'src'))); 
app.use('/public', express.static(path.join(__dirname, 'public'))); 
app.use(express.json());

// 2. Helper Function: JSON data read karne ke liye
const readJSONFile = (filePath) => {
    try {
        // Path.join Windows aur Linux dono mein sahi se kaam karta hai
        const data = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // Agar file na mile toh console mein error aayega
        console.error(`Error reading file ${filePath}:`, err);
        return [];
    }
};

// 3. API Routes (Data Endpoints)

// Root (Homepage)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// All Products API Endpoint (Merch aur Digital)
app.get('/api/products', (req, res) => {
    const products = readJSONFile('src/data/products.json');
    res.json(products);
});

// Courses API Endpoint
app.get('/api/courses', (req, res) => {
    const courses = readJSONFile('src/data/courses.json');
    res.json(courses);
});

// 4. Server Start Karna
app.listen(PORT, () => {
    console.log(`🚀 CodeByTushu Server running on http://localhost:${PORT}`);
    console.log(`Test Merch Page at: http://localhost:${PORT}/merch.html`);
});