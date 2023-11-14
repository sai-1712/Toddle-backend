import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const fileUpload = async (file) => {
  const { createReadStream, filename, mimetype, encoding } = await file.promise;
  const currentDirectory = process.cwd();
  const filePath = path.join(currentDirectory, "uploads", filename);
  const fileStream = createReadStream();

  return new Promise((resolve, reject) => {
    fileStream
      .pipe(fs.createWriteStream(filePath))
      .on("finish", () => resolve({ filename, mimetype }))
      .on("error", (error) => {
        fs.unlinkSync(filePath);
        reject(false);
      });
  });
};

const sendEmail = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // console.log(error);
    } else {
      console.log("Email sent");
    }
  });
};

export { fileUpload, sendEmail };
