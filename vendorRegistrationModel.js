const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    stallName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10}$/ // Ensures it's a 10-digit number
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, // Stores the email in lowercase
        match: /^\S+@\S+\.\S+$/ // Basic email format validation
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    accountNumber: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{9,18}$/ // Matches a number between 9 and 18 digits
    },
    ifsc: {
        type: String,
        required: true,
        trim: true,
        uppercase: true, // Stores the IFSC code in uppercase
        match: /^[A-Z]{4}0[0-9]{6}$/ // Standard IFSC code format
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model for use in your application
module.exports = mongoose.model("Vendor", vendorSchema);
