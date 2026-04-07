const express = require("express");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dbCon = require("./app/config/dbcon");

const app = express();

dbCon();

app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);
// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Static folders
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Routes
app.use("/api", require("./app/routes/auth.routes"));
app.use("/api/doctors", require("./app/routes/doctor.routes"));
app.use("/api/appointments", require("./app/routes/appointment.routes"));

//  Health check route (very useful)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Global error handler (recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});



const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});