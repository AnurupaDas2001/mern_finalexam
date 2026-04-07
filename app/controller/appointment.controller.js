const { appointmentModel, AppointmentValidationSchema } = require("../model/appointment.model");

class AppointmentController {

  async book(req, res) {
    try {
      
      const { error } = AppointmentValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { doctorId, date, time } = req.body;

      const exists = await appointmentModel.findOne({
        doctorId,
        date,
        time,
        status: "booked",
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Slot already booked",
        });
      }

      const appointment = await appointmentModel.create({
        userId: req.user.id,
        doctorId,
        date,
        time,
      });

      return res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        data: appointment,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // 👤 USER APPOINTMENTS
  async myAppointments(req, res) {
    try {
      const data = await appointmentModel
        .find({ userId: req.user.id })
        .populate("doctorId");

      return res.json({
        success: true,
        count: data.length,
        data,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // 🧑‍💼 ADMIN - ALL APPOINTMENTS
  async allAppointments(req, res) {
    try {
      const data = await appointmentModel
        .find()
        .populate("userId")
        .populate("doctorId");

      return res.json({
        success: true,
        count: data.length,
        data,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async cancel(req, res) {
    try {
      const appointment = await appointmentModel.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      //  Only owner or admin can cancel
      if (
        appointment.userId.toString() !== req.user.id &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to cancel this appointment",
        });
      }

      appointment.status = "cancelled";
      await appointment.save();

      return res.json({
        success: true,
        message: "Appointment cancelled successfully",
        data: appointment,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new AppointmentController();