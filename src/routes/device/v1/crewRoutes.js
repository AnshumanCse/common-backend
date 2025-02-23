const express = require("express");
const router = express.Router();
const crewController = require("../../../controller/crewController");

router.post("/crew", crewController.createCrew);
router.get("/crew", crewController.getAllCrews);
router.get("/crew/:id", crewController.getCrewById);
router.put("/crew/:id", crewController.updateCrew);
router.delete("/crew/:id", crewController.deleteCrew);

module.exports = router;
