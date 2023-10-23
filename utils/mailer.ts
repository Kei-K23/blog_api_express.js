import nodemailer, { SendMailOptions, getTestMessageUrl } from "nodemailer";
import logger from "./logger";

// const Host = "smtp.ethereal.email";
// const Port = 587;
// const Security = "STARTTLS";
// const Username = "juliana.vonrueden@ethereal.email";
// const Password = "MCbeF9DsNEBrDasfkw";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "juliana.vonrueden@ethereal.email",
    pass: "MCbeF9DsNEBrDasfkw",
  },
});

function sendEmail(payload: SendMailOptions) {
  const send = transporter.sendMail(payload, (error) => {
    if (error) throw new Error("error while sending email");
  });
  return send;
}

export default transporter;
