const express = require("express");
const router = express.Router();
const dutyControllers = require("../../../controller/dutyController")


router.post("/duties", dutyControllers.createDuty);
router.get("/duties", dutyControllers.getAllDuties);
router.get("/duties/:id", dutyControllers.getDutyById);
router.put("/duties/:id", dutyControllers.updateDuty);
router.delete("/duties/:id", dutyControllers.deleteDuty);

module.exports = router;
