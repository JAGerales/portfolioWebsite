const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'public', 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Route for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Route for About Me
app.post('/contactMe', async (req, res) => {
  const {name, email, message} = req.body;

  // need to use ENV file
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jacob.a.gerales@gmail.com',
      pass: 'itiy slwn nbcp qidw'
    }
  });

  const mailOptions = {
    from: email, // Sender address
    to: 'jacob.a.gerales@gmail.com', // List of recipients
    subject: 'New Contact Form Submission', // Subject line
    text: `You have received a new message from ${name} (${email}):\n\n${message}` // Plain text body
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
