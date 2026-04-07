const express = require("express");
const router = express.Router(); 

const doctorController = require("../controller/doctor.controller");
const authMiddleware  = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");


router.get("/", doctorController.getDoctors);
router.post("/", authMiddleware, doctorController.createDoctor);
router.put("/:id", authMiddleware, doctorController.updateDoctor);
router.delete("/:id", authMiddleware,  doctorController.deleteDoctor);

module.exports = router;