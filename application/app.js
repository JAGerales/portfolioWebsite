const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'public', 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Route for About Me
app.get('/contactMe', (req, res) => {
  res.render('contactMe');
});

// Route for Projects
app.get('/projects', (req, res) => {
  res.render('projects');
});

// Route for Pictures
app.get('/pictures', (req, res) => {
  res.render('pictures');
});

// Route for Blog
app.get('/blog', (req, res) => {
  res.render('blog');
});

// Start the server
app.listen(port, () => {
  console.log(`Website listening at http://localhost:${port}`);
});
