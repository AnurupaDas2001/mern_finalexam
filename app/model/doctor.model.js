const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: String,
  specialization: String,
  fees: Number,
 availableSlots: {
  type: [String],
  default: []
}
});
 const doctorModel = mongoose.model('Doctor',doctorSchema)
 module.exports={doctorModel}

