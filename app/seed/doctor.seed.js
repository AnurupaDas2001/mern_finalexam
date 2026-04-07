// seed/doctor.seed.js

const { doctorModel } = require("../model/doctor.model");


const seedDoctors = async () => {
  await doctorModel.deleteMany();

  await doctorModel.insertMany([
    { name: "Dr. A", specialization: "Cardio", fees: 500 },
    { name: "Dr. B", specialization: "Dermatology", fees: 300 },
    { name: "Dr. C", specialization: "Neuro", fees: 700 },
    { name: "Dr. D", specialization: "Ortho", fees: 400 },
    { name: "Dr. E", specialization: "General", fees: 200 }
  ]);

  console.log("Doctors seeded");
};

module.exports = seedDoctors;