// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 4000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'public', 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Form Limiter
const contactFormLimiter = rateLimit({
  windowsMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 requests every 15 min
  message: "Too many requests from this IP. Limiting Contact"
});

// Route for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Route for Contact Me
app.post('/contactMe', contactFormLimiter, async (req, res) => {
  const { name, email, message, hiddenField } = req.body;

  if (hiddenField){
    return res.status(400).send('Bot Detected. Leave me alone!');
  }
  if (!validator.isEmail(email) || !validator.isLength(message, { min: 1, max: 500 })) {
    return res.status(400).send('Invalid Input');
  } 
 
  const mailOptions = {
    from: email, // Sender address
    to: process.env.EMAIL_USER, // List of recipients
    subject: 'New Contact Form Submission', // Subject line
    text: `You have received a new message from ${name} (${email}):\n\n${message}`, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Message sent successfully");
    res.render('index');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending message.');
  }
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
