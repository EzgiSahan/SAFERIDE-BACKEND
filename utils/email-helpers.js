import nodemailer from 'nodemailer';

export function generateEmailTemplate(username, verificationLink) {
    return `
        Hello ${username},
        To verify your account, please click on the link below:
        ${verificationLink}`;
}

export async function sendVerificationEmail(email, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: 'ezgisahan2001@gmail.com',
                pass: 'xtcmvjbbbqfzpogv'
            }
        });

        await transporter.sendMail({
            from: "ammarkaid321@gmail.com",
            to: email,
            subject: subject,
            text: text
        });
        console.log('Email sent successfully!');
        
    } catch (error) {
        console.log('Email not sent');
        console.log(error);
    }
}
