const express = require("express");
const router = express.Router(); 

const appointmentController = require("../controller/appointment.controller");

const authMiddleware = require("../middleware/auth.middleware");





router.post("/", authMiddleware, appointmentController.book);
router.get("/my", authMiddleware, appointmentController.myAppointments);
router.get("/all", authMiddleware,  appointmentController.allAppointments);
router.put("/cancel/:id", authMiddleware, appointmentController.cancel);

module.exports = router;