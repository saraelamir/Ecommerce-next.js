const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"ShopZone" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error(" Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };