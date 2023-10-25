const nodemailer = require("nodemailer");

exports.emailVerification = (fullName, email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'zaferistak@gmail.com',
            pass: 'zwitfbjcfwyuivwp'
        }
    });

    const verifyLink = `http://localhost:3000/emailverification?token=${token}`;

    const mailOptions = {
        from: '"Task Manager" <zaferistak@gmail.com>',
        to: email,
        subject: "Email verification - Task manager",
        html: `<p>Hi ${fullName},</p> <p>Thanks for signing up with Task Manager. To activate your account, please click on the link below or copy and paste it into your web browser:</p> <p>${verifyLink}</p> <p> If you didn't create an account with us, please ignore this message. </p> <p>Welcome to Task Manager</p>`,
    };

    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions)
            console.log('mail send')
        } catch (error) {
            console.log(error)
        }
    }

    sendMail(transporter, mailOptions);
}