const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const {
  userModel,
  UserRegistrationValidationSchema,
  UserLoginValidationSchema,
} = require("../model/user.model");

class AuthController {

  // ======================
  // ✅ REGISTER
  // ======================
  async register(req, res) {
    try {
      // 🔐 Joi Validation
      const { error } = UserRegistrationValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { name, email, phone, password } = req.body;

      // ✅ Check existing user
      const exists = await userModel.findOne({
        $or: [{ email }, { phone }],
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Email or phone already registered",
        });
      }

      // 🔒 Hash password
      const hashed = await bcrypt.hash(password, 10);

      // ✅ Create user (no verification logic)
      const user = await userModel.create({
        name,
        email,
        phone,
        password: hashed,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token: generateToken(user),
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ======================
  // ✅ LOGIN
  // ======================
  async login(req, res) {
    try {
      // 🔐 Joi Validation
      const { error } = UserLoginValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { email, password } = req.body;

      // 🔍 Find user
      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // 🔑 Compare password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      return res.json({
        success: true,
        message: "Login successful",
        token: generateToken(user),
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new AuthController();