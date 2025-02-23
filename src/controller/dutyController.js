const Duty = require("../model/Duty");
const dbService = require("../utils/dbServices");

/**
 * @description : Create a new duty assignment.
 */

const createDuty = async (req, res) => {
    try {
        const { date, vehicleId, driverId, conductorId, startTime, duration } = req.body;

        // Validate duration fields
        if (
            !duration ||
            typeof duration.hours !== "number" ||
            typeof duration.minutes !== "number" ||
            duration.hours < 0 || duration.hours > 24 ||
            duration.minutes < 0 || duration.minutes > 59
        ) {
            return res.status(400).json({ status: "error", message: "Invalid duration. Hours must be 0-24, and minutes must be 0-59." });
        }

        // Validate startTime format (HH:mm)
        if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(startTime)) {
            return res.status(400).json({ status: "error", message: "Invalid start time format. Use HH:mm (e.g., 06:30, 14:45)." });
        }

        // Check if vehicle already has a duty on the same day
        const existingVehicleDuty = await Duty.findOne({ date, vehicleId });
        if (existingVehicleDuty) {
            return res.status(400).json({ status: "error", message: "This vehicle already has a duty on this day." });
        }

        // Check if driver is assigned to another vehicle on the same day
        const existingDriverDuty = await Duty.findOne({ date, driverId });
        if (existingDriverDuty) {
            return res.status(400).json({ status: "error", message: "This driver is already assigned to another vehicle on this day." });
        }

        // Check if conductor is assigned to another vehicle on the same day
        const existingConductorDuty = await Duty.findOne({ date, conductorId });
        if (existingConductorDuty) {
            return res.status(400).json({ status: "error", message: "This conductor is already assigned to another vehicle on this day." });
        }

        // Create new duty with the updated fields
        const newDuty = await dbService.create(Duty, {
            date,
            vehicleId,
            driverId,
            conductorId,
            startTime,
            duration
        });

        return res.status(201).json({ status: "success", data: newDuty });

    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Get all duty assignments with pagination.
 */

// const getAllDuties = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const options = { page, limit, sort: { date: -1 }, populate: ["vehicleId", "driverId", "conductorId"] };

//         const duties = await Duty.paginate({}, options);
//         return res.status(200).json({ status: "success", data: duties });
//     } catch (error) {
//         return res.status(500).json({ status: "error", message: error.message });
//     }
// };

const getAllDuties = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Initialize an empty filter
        let filter = {};

        // Apply date filter only if both startDate and endDate are provided
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const options = {
            page,
            limit,
            sort: { date: -1 },
            populate: ["vehicleId", "driverId", "conductorId"]
        };

        // Fetch data with pagination
        const duties = await Duty.paginate(filter, options);

        return res.status(200).json({
            status: "success",
            // message: duties.docs?.length ? "Duties fetched successfully." : "No duties available.",
            data: duties
        });

    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};



/**
 * @description : Get a single duty by ID.
 */
const getDutyById = async (req, res) => {
    try {
        const duty = await Duty.findById(req.params.id).populate("vehicleId driverId conductorId");
        if (!duty) return res.status(404).json({ status: "error", message: "Duty not found." });
        return res.status(200).json({ status: "success", data: duty });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Update a duty assignment by ID.
 */
const updateDuty = async (req, res) => {
    try {
        const { date, vehicleId, driverId, conductorId } = req.body;
        const dutyId = req.params.id;

        // Check for existing assignments if values are changed
        if (vehicleId) {
            const existingVehicleDuty = await Duty.findOne({ date, vehicleId, _id: { $ne: dutyId } });
            if (existingVehicleDuty) return res.status(400).json({ status: "error", message: "This vehicle already has a duty on this day." });
        }

        if (driverId) {
            const existingDriverDuty = await Duty.findOne({ date, driverId, _id: { $ne: dutyId } });
            if (existingDriverDuty) return res.status(400).json({ status: "error", message: "This driver is already assigned to another vehicle on this day." });
        }

        if (conductorId) {
            const existingConductorDuty = await Duty.findOne({ date, conductorId, _id: { $ne: dutyId } });
            if (existingConductorDuty) return res.status(400).json({ status: "error", message: "This conductor is already assigned to another vehicle on this day." });
        }

        const updatedDuty = await Duty.findByIdAndUpdate(dutyId, req.body, { new: true, runValidators: true }).populate("vehicleId driverId conductorId");
        if (!updatedDuty) return res.status(404).json({ status: "error", message: "Duty not found." });
        return res.status(200).json({ status: "success", data: updatedDuty });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Delete a duty assignment by ID.
 */
const deleteDuty = async (req, res) => {
    try {
        const duty = await Duty.findByIdAndDelete(req.params.id);
        if (!duty) return res.status(404).json({ status: "error", message: "Duty not found." });
        return res.status(200).json({ status: "success", message: "Duty deleted successfully." });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { createDuty, getAllDuties, getDutyById, updateDuty, deleteDuty };
