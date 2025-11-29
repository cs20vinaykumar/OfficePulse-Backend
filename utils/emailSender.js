import nodemailer from "nodemailer";
import { getUserEmailGateway } from "../services/emailGateway/emailgatewayService.js";

const createTransporter = ({ host, port, secure, user, pass }) =>
  nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

export const sendEmail = async (
  currentUser,
  emailContent,
  subject,
  sendEmailTo
) => {
  try {
    const gateway = await getUserEmailGateway(currentUser);
    let transporterConfig;

    if (gateway.data?.isActive) {
      transporterConfig = {
        host: gateway.data.smtpServerHost,
        port: gateway.data.smtpServerPort || 465,
        secure: true,
        user: gateway.data.smtpUsername,
        pass: gateway.data.smtpPassword,
      };
    } else {
      transporterConfig = {
        host: process.env.DEFAULT_SMTP_SERVER_HOST,
        port: parseInt(process.env.DEFAULT_SMTP_SERVER_PORT, 10) || 465,
        secure: process.env.DEFAULT_SMTP_SECURITY === "TLS",
        user: process.env.DEFAULT_SMTP_USERNAME,
        pass: process.env.DEFAULT_SMTP_PASSWORD,
      };
    }

    const transporter = createTransporter(transporterConfig);

    const mailOptions = {
      from: `${gateway.data?.fromName || process.env.DEFAULT_FROM_NAME} <${
        transporterConfig.user
      }>`,
      to: sendEmailTo,
      subject,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
