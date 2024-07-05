// const express = require("express");
// const bodyParser = require("body-parser");
// const { PrismaClient } = require("@prisma/client");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const app = express();
// const prisma = new PrismaClient();
// const port = process.env.PORT || 3300;

// app.use(bodyParser.json());

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
// });

// // API to handle referral form submission
// app.post("/api/referrals", async (req, res) => {
//   const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

//   if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const newReferral = await prisma.referral.create({
//       data: {
//         referrerName,
//         referrerEmail,
//         refereeName,
//         refereeEmail,
//       },
//     });

//     const mailOptions = {
//       from: process.env.GMAIL_USER,
//       to: refereeEmail,
//       subject: "You have been referred to our course!",
//       text: `Hello ${refereeName},\n\n${referrerName} has referred you to our course. Sign up now to start learning!\n\nBest regards,\nThe Team`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res.status(500).json({ error: "Error sending email" });
//       } else {
//         console.log("Email sent: " + info.response);
//         res.status(201).json(newReferral);
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const cors = require("cors"); // Import cors package
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3300;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Use CORS middleware
app.use(cors());

// API to handle referral form submission
app.post("/api/referrals", async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

  if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newReferral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: refereeEmail,
      subject: "You have been referred to our course!",
      text: `Hello ${refereeName},\n\n${referrerName} has referred you to our course. Sign up now to start learning!\n\nBest regards,\nThe Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json(newReferral);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
