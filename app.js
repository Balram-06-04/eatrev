require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
// const PORT = 3000;
const path = require("path");
const Review = require("./reviewModel");
const Vendor = require("./vendorRegistrationModel");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("./cloudinary");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Multer config (temporary local storage, just for upload)
const upload = multer({ dest: "uploads/" });

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public"));
});

// Sending all reviews to frontend
app.get("/getAllReviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});


// Saving street food reviews
app.post("/submit", upload.single("image"), async (req, res) => {
  const { stallName, stallLocation, dishName, reviewText, hygieneCondition, overallRating, worthIt } = req.body;

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "users", // optional folder name in Cloudinary
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    // Save review
    const newReview = new Review({
      stallName,
      stallLocation,
      dishName,
      reviewText,
      hygieneCondition,
      overallRating,
      worthIt,
      photo: result.secure_url, // save Cloudinary URL
    });

    await newReview.save();
    res.status(201).json(newReview);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data" });
  }
});

// Saving vendor data
app.post("/vendorData", async (req, res) => {
  const { stallName, phone, email, location, state, city, accountNumber, ifsc, description } = req.body;

  try {
    const newVendor = new Vendor({
      stallName, phone, email, location, state, city, accountNumber, ifsc, description
    });

    await newVendor.save();
    res.status(201).json(newVendor);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data" });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
