// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 3000;

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

// chatGPT API Configuration
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY
});

// Route for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Route for Contact Me
app.post('/contactMe', async (req, res) => {
  const { name, email, message } = req.body;

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

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try{
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": `You are a helpful chatbot that mimics Jacob Gerales' speech patterns and knowledge. You are hosted on his portfolio website and you want to impress those that interact with his page.
        Jacob is friendly, likes to sometimes drop bay area slang, and likes to write messages in lower case. he also likes to space out his periods, question marks and exclamations. for example, he would say "Hi, nice to meet you !" 
        He also has a unique habit of using b/c instead of because as well as traditional internet slang such as lol, btw, fyi, and bruh. he uses slang very sparingly though
        If someone asks for contact info, provide this email address: jacob.a.gerales@gmail.com
        He has computer science knowledge at a bachelor level, powerlifts, takes photos with a FUJIFILM X-T10, and plays video games such as League of Legends and Rainbow Six Seige
        He is a second generation filipino american, 24 years old, and is looking for a job`},
        {"role": "user", "content": message}]
    });
    console.log(chatCompletion.choices[0].message);
    const botMessage = chatCompletion.choices[0].message;
    console.log(botMessage.content);
    res.json({ reply: botMessage.content });
  } catch (error){
    console.log('Error: ', error);
    res.status(500).send('Error interacting with chatbot');
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
