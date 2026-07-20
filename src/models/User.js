import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Must be a valid email address."],
        },
        password: {
            type: String,
            required: [true, "Password is required."],
            minlength: [6, "Password must be at least 6 characters."],
        },
        displayName: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["student", "admin", "superadmin"],
            default: "student",
        },
        status: {
            type: String,
            enum: ["active", "banned"],
            default: "active",
        },
        interests: {
            type: [String],
            enum: ["Life", "Drama", "Science", "Sports", "Tech", "Security", "Travel", "Blogging", "Health"],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);