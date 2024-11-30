const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'nrotramy28@gmail.com',
        pass: 'soya vcbw owzo snsm'
    }
});

module.exports = { transporter };
