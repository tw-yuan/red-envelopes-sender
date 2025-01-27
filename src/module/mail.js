import nodemailer from 'nodemailer';
const config = require('../../config.json');

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: true,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

export default transporter;