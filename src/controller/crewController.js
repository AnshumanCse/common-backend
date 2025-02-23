const Crew = require("../model/Crew");

/**
 * @desc Create a new crew member (Driver or Conductor)
 * @route POST /api/crews
 */
const createCrew = async (req, res) => {
    try {
        const { name, role } = req.body;

        // Validate request body
        if (!name || !role) {
            return res.status(400).json({ message: "Name and Role are required" });
        }

        // Validate role
        if (!["Driver", "Conductor"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'Driver' or 'Conductor'" });
        }

        const newCrew = new Crew({ name, role });
        await newCrew.save();

        res.status(201).json({ message: "Crew member created successfully", data: newCrew });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * @desc Get all crew members
 * @route GET /api/crews
 */
const getAllCrews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const options = { page, limit, sort: { createdAt: -1 } };

        const crews = await Crew.paginate({}, options);
        return res.status(200).json({ status: "success", data: crews });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};


/**
 * @desc Get a single crew member by ID
 * @route GET /api/crews/:id
 */
const getCrewById = async (req, res) => {
    try {
        const crew = await Crew.findById(req.params.id);
        if (!crew) {
            return res.status(404).json({ message: "Crew member not found" });
        }
        res.status(200).json(crew);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * @desc Update crew member details
 * @route PUT /api/crews/:id
 */
const updateCrew = async (req, res) => {
    try {
        const { name, role } = req.body;

        const crew = await Crew.findById(req.params.id);
        if (!crew) {
            return res.status(404).json({ message: "Crew member not found" });
        }

        if (name) crew.name = name;
        if (role) {
            if (!["Driver", "Conductor"].includes(role)) {
                return res.status(400).json({ message: "Invalid role. Must be 'Driver' or 'Conductor'" });
            }
            crew.role = role;
        }

        await crew.save();
        res.status(200).json({ message: "Crew member updated successfully", data: crew });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * @desc Delete a crew member
 * @route DELETE /api/crews/:id
 */
const deleteCrew = async (req, res) => {
    try {
        const crew = await Crew.findById(req.params.id);
        if (!crew) {
            return res.status(404).json({ message: "Crew member not found" });
        }

        await Crew.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Crew member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createCrew, getAllCrews, getCrewById, updateCrew, deleteCrew };
