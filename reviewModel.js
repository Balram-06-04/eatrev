const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    stallName: {
        type: String,
        required: true,
        trim: true
    },
    stallLocation: {
        type: String,
        required: true,
        trim: true
    },
    dishName: {
        type: String,
        required: true,
        trim: true
    },
    reviewText: {
        type: String,
        required: true,
        maxlength: 500
    },
    hygieneCondition: {
        type: String,
        enum: ["clean", "average", "dirty"],
        default: "average"
    },
    overallRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    worthIt: {
        type: String,
        enum: ["yes", "no"],
        required: true
    },
    photo: {
        type: String, // we will store the photo URL or filename here
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export model
module.exports = mongoose.model("Review", reviewSchema);
