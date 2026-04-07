const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");


// =====================
// ✅ JOI VALIDATIONS
// =====================

// 🔐 Register Validation
const UserRegistrationValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be 10–15 digits",
      "string.empty": "Phone is required",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  role: Joi.string()
    .valid("USER", "ADMIN")
    .optional(),
});


// 🔑 Login Validation
const UserLoginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});


// =====================
// 📦 MONGOOSE SCHEMA
// =====================

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


// =====================
// 🚀 EXPORT
// =====================

const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
  UserRegistrationValidationSchema,
  UserLoginValidationSchema,
};