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

// 🔍 Search reviews
// Sending search reviews
app.get("/searchReviews", async (req, res) => {
  const { location, food } = req.query;

  let filter = {};

  if (location) {
    filter.stallLocation = { $regex: location, $options: "i" }; // case-insensitive
  }
  if (food) {
    filter.dishName = { $regex: food, $options: "i" };
  }

  try {
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ message: "Error searching reviews" });
  }
});


// Saving street food reviews
// Saving street food reviews
app.post("/submit", upload.single("image"), async (req, res) => {
  const {
    stallName,
    stallLocation,
    dishName,
    reviewText,
    hygieneCondition,
    overallRating,
    worthIt,
    latitude,
    longitude
  } = req.body;

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "users",
    });

    fs.unlinkSync(req.file.path); // Delete local file

    // ✅ INCLUDE LATITUDE & LONGITUDE HERE
    const newReview = new Review({
      stallName,
      stallLocation,
      dishName,
      reviewText,
      hygieneCondition,
      overallRating,
      worthIt,
      photo: result.secure_url,
      latitude: parseFloat(latitude),      // Important to parse to Number
      longitude: parseFloat(longitude)
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data" });
  }
});


// Saving vendor data
app.post("/vendorData", upload.single("image"), async (req, res) => {
  const { stallName, phone, email, location, state, city, accountNumber, ifsc, description } = req.body;

  try {
    // Upload image to Cloudinary
    const picture = await cloudinary.uploader.upload(req.file.path, {
      folder: "VendorRegistrationPhoto", // optional folder name in Cloudinary
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);
    const newVendor = new Vendor({
      stallName, phone, email, location, state, city, accountNumber, ifsc, description, photo: picture.secure_url, // save Cloudinary URL
    });

    await newVendor.save();
    res.status(201).json(newVendor);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data" });
  }
});

app.get("/getAllVendors", async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vendors details" });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
