// utils/emailService.js
import nodemailer from 'nodemailer';

// **Send Email Function**
const sendEmail = async (to, subject, html) => {
  try {
    // Create a transporter using Gmail service and authentication details from environment variables
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define email details
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    // Send the email and capture the response
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

export default sendEmail;
