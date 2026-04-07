const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");


const AppointmentValidationSchema = Joi.object({
  doctorId: Joi.string().required().messages({
    "string.empty": "Doctor ID is required",
  }),

  date: Joi.string().required().messages({
    "string.empty": "Date is required",
  }),

  time: Joi.string().required().messages({
    "string.empty": "Time is required",
  }),
});

const appointmentSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },

  date: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  }

}, { timestamps: true });


const appointmentModel = mongoose.model("Appointment", appointmentSchema);

module.exports = {
  appointmentModel,
  AppointmentValidationSchema
};