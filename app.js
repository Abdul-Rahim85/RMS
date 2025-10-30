// app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const cookieParser = require('cookie-parser');
const dashboardRoute = require('./routes/dashboard');

// Add variable from .env
dotenv.config();

// COnnect to MongoDB
connectDB();

// Create the Express App
const app = express();

// ===== Middleware =====

// Body Parser Middleware
app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, 'public')),
  cookieParser()
]);
app.use('/icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));

// App View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== Routes =====
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});
app.use('/dashboard', dashboardRoute);

// ===== Running the server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
