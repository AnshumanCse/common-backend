const Vehicle = require("../model/Vehicle");
const dbService = require("../utils/dbServices");

/**
 * @description : Create a new vehicle.
 */
const createVehicle = async (req, res) => {
    try {
        const { name, vehicleNumber, type } = req.body;

        // Check if vehicle name or vehicle number already exists
        const existingVehicle = await Vehicle.findOne({
            $or: [{ vehicleNumber }]
        });

        if (existingVehicle) {
            return res.status(400).json({
                status: "error",
                message: "Vehicle with this Number already exists."
            });
        }

        const newVehicle = await Vehicle.create({ name, vehicleNumber, type });

        return res.status(201).json({ status: "success", data: newVehicle });

    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Get all vehicles with pagination.
 */
const getAllVehicles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = { page, limit, sort: { createdAt: -1 } };

        const vehicles = await Vehicle.paginate({}, options);
        return res.status(200).json({ status: "success", data: vehicles });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Get a single vehicle by ID.
 */
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ status: "error", message: "Vehicle not found." });
        return res.status(200).json({ status: "success", data: vehicle });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Update a vehicle by ID.
 */
const updateVehicle = async (req, res) => {
    try {
        const { name } = req.body;
        const vehicleId = req.params.id;

        // Check if vehicle name already exists (excluding current vehicle)
        const existingVehicle = await Vehicle.findOne({ name, _id: { $ne: vehicleId } });
        if (existingVehicle) {
            return res.status(400).json({ status: "error", message: "Vehicle with this name already exists." });
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, { name }, { new: true, runValidators: true });
        if (!updatedVehicle) return res.status(404).json({ status: "error", message: "Vehicle not found." });
        return res.status(200).json({ status: "success", data: updatedVehicle });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Delete a vehicle by ID.
 */
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).json({ status: "error", message: "Vehicle not found." });
        return res.status(200).json({ status: "success", message: "Vehicle deleted successfully." });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { createVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle };
