const { doctorModel } = require("../model/doctor.model");

class DoctorController {

  // ======================
  // ✅ GET ALL DOCTORS
  // ======================
  async getDoctors(req, res) {
    try {
      const { search, specialization } = req.query;

      let query = {};

      // 🔍 Search by name
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      // 🏥 Filter by specialization
      if (specialization) {
        query.specialization = {
          $regex: specialization,
          $options: "i",
        };
      }

      const doctors = await doctorModel.find(query);

      return res.json({
        success: true,
        count: doctors.length,
        data: doctors,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ======================
  // ➕ ADD DOCTOR (ADMIN)
  // ======================
  async createDoctor(req, res) {
    try {
      const { name, specialization, fees, availableSlots } = req.body;

      // ❌ Basic validation
      if (!name || !specialization || !fees) {
        return res.status(400).json({
          success: false,
          message: "Name, specialization and fees are required",
        });
      }

      const doctor = await doctorModel.create({
        name,
        specialization,
        fees,
        availableSlots,
      });

      return res.status(201).json({
        success: true,
        message: "Doctor added successfully",
        data: doctor,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ======================
  // ✏️ UPDATE DOCTOR
  // ======================
  async updateDoctor(req, res) {
    try {
      const doctor = await doctorModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      return res.json({
        success: true,
        message: "Doctor updated successfully",
        data: doctor,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ======================
  // ❌ DELETE DOCTOR
  // ======================
  async deleteDoctor(req, res) {
    try {
      const doctor = await doctorModel.findByIdAndDelete(req.params.id);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      return res.json({
        success: true,
        message: "Doctor deleted successfully",
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new DoctorController();