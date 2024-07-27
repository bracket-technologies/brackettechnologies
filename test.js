const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using Gmail's SMTP server
let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'komikbenim@gmail.com',
        pass: 'zcybkidtudibysxh'
    }
});

// Email options
let mailOptions = {
    from: 'komikbenim@gmail.com',
    to: 'komikbenim@gmail.com',
    subject: 'Test Email',
    text: 'I love you!',
    html: '<p>This is a test email sent from my domain using Nodemailer.</p>'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error:', error);
    }
    console.log('Email sent:', info.response);
});