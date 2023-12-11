import nodemailer from "nodemailer"




function sendEmail(emailData: any): Promise<void> {

  emailData.from = `"OPTICASH" <${process.env.EMAIL_USERNAME}>`;
  console.log(emailData);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "preciousemmanuel32@gmail.com",
      pass: "sukdtgyyfwbvjuhe"
    }
  });

  return (
    transporter
      .sendMail(emailData)
      .then((info) => console.log(`Message sent: ${info.response} `))
      .catch((error) => console.log(error))
  );
};

export default sendEmail;