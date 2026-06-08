import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email env missing. Skipping email send.");
    return;
  }

  await mailer.sendMail({
    from: `"Virsa Flour Mills" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject,
    html,
  });
}
