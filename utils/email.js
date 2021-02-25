const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // step 1 Create a transporder
  const transporder = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
    //   NOTE ACTIVATE LESS SECURE APP OTION IN MY EMAIL ADDRESS
  });
  // step 2 define email options
  const mailOptions = {
    from: 'David Joseph <admins@me.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // step 3 Actually send the email?
  await transporder.sendMail(mailOptions);
};

module.exports = sendEmail;
