const mongoose = require("mongoose");
const UserRoleEnum = require("../../enums");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String, unique: true, index: true }, // Unique index
    password: { type: String },
    phoneNo: { type: String, index: true }, // Indexed for faster lookups
    role: { type: String, enum: Object.values(UserRoleEnum), index: true }, // Indexing for role-based queries
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true, // Faster lookup for users under a manager
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create compound index for faster queries on role & reportingManager
userSchema.index({ role: 1, reportingManager: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
