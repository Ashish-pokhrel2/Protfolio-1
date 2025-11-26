const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS  // Your email password or app password
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP Configuration Error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for about section
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for skills section
app.get('/skills', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for gallery section
app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for projects section
app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for contact section
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Static files - AFTER routes
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Contact form endpoint
app.post('/send-email', async (req, res) => {
  const { name, email, topic, message } = req.body;

  // Validate form data
  if (!name || !email || !topic || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  // Email options
  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER, 
    replyTo: email,
    subject: `Portfolio Contact: ${topic}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${topic}</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
          <p style="color: #4b5563; line-height: 1.6;">${message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent from your portfolio contact form.
        </p>
      </div>
    `
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
