// lib/sendEmail.js

import nodemailer from 'nodemailer';

// Create a transporter using Gmail and App Password
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using Nodemailer
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject of the email
 * @param {string} html - HTML content of the email
 * @returns {Promise<void>}
 */
export async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"JFIT" <${process.env.EMAIL_USER}>`, // Sender address
    to, // List of receivers
    subject, // Subject line
    html, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error; // Propagate the error to handle it upstream
  }
}