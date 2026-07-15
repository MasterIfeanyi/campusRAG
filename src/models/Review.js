import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters."],
            default: "",
        },
        body: {
            type: String,
            required: [true, "Review body is required."],
            trim: true,
            minlength: [10, "Review must be at least 10 characters."],
            maxlength: [3000, "Review cannot exceed 3000 characters."],
        },
        categories: {
            type: [String],
            default: ["general"],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "At least one category is required.",
            },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A review must be linked to a user."],
        },
        embedding: {
            type: [Number],
            required: [true, "Embedding is required."],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length === 3072,
                message: "Embedding must have exactly 3072 dimensions.",
            },
        },
        status: {
            type: String,
            enum: ["visible", "under_review", "removed"],
            default: "visible",
        },
        flags: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                reasonCategory: {
                    type: String,
                    enum: ["spam", "hate_speech", "impersonation", "false_accusations", "harassment", "other"],
                    required: [true, "A flag reason category is required."],
                },
                reasonDetail: {
                    type: String,
                    trim: true,
                    maxlength: [300, "Additional details cannot exceed 300 characters."],
                    default: "",
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true, // automatically adds createdAt and updatedAt
    }
);

// Prevents Mongoose from redefining the model on every hot reload in dev
export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);