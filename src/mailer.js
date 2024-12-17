const nodemailer = require('nodemailer');
require('dotenv').config();

const sendNotification = async (message) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: 'Website Change Detected',
    text: message,
  });
};

module.exports = sendNotification;
