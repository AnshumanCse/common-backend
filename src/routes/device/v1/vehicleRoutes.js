const express = require("express");
const router = express.Router();
const vehicleController = require("../../../controller/vehicelController");

router.post("/vehicle", vehicleController.createVehicle);
router.get("/vehicle", vehicleController.getAllVehicles);
router.get("/vehicle/:id", vehicleController.getVehicleById);
router.put("/vehicle/:id", vehicleController.updateVehicle);
router.delete("/vehicle/:id", vehicleController.deleteVehicle);

module.exports = router;
