const Deal = require("../models/DealsModel");
const User = require("../models/UserModel"); // Ensure you have a User model
const nodemailer = require("nodemailer"); // Nodemailer for sending emails
require("dotenv").config();

exports.createBundleDeal = async (req, res) => {
  const {
    name,
    price,
    category,
    sizes,
    createdAt,
    discountPercentage,
    validityPeriod,
  } = req.body;
  const images = req.file;

  // Ensure required fields are present
  if (!name || !price || !category || !sizes || !images) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const imagePath = "/uploads/" + req.file.filename;

  try {
    const newBundleDeal = new Deal({
      name,
      price,
      images: imagePath,
      createdAt,
      category,
      sizes,
      discountPercentage,
      validityPeriod,
    });

    const savedBundleDeal = await newBundleDeal.save();

    // Fetch all user emails
    const users = await User.find({}, "email");
    const userEmails = users.map((user) => user.email);

    // Send notification emails
    const sendNotification = await sendNotificationEmails(
      userEmails,
      newBundleDeal
    );

    res.json(savedBundleDeal);
  } catch (error) {
    console.log("Error While Creating Bundle Deals", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to send notification emails
async function sendNotificationEmails(userEmails, deal) {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "efrain.treutel@ethereal.email",
      pass: "Zfeb8xsaGVzxfgbNF5",
    },
  });

  const emailPromises = userEmails.map((email) => {
    // Create the email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `New Bundle Deal: ${deal.name}`,
      text: `Hello, we have a new bundle deal: ${deal.name} available at a discounted price of ${deal.price}.`,
      html: `<b>Hello,</b><br><br>We have a new bundle deal: <b>${deal.name}</b> available at a discounted price of <b>${deal.price}</b>.`,
    };

    // Send the email
    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(emailPromises);
    console.log("Notification emails sent successfully");
    return "Notification emails sent successfully";
  } catch (error) {
    console.error("Error sending notification emails:", error);
    return `Error sending notification emails: ${error.message}`;
  }
}

exports.getDealCount = async (req, res) => {
  try {
    const count = await Deal.countDocuments();
    res.json({
      status: "success",
      data: {
        count: count,
      },
    });
  } catch (error) {
    console.error("Error fetching deal count:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
