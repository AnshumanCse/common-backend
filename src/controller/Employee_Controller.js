const Employee = require("../model/Employee");
const dbService = require("../utils/dbServices");

/**
 * @description : Create a new employee.
 * @param {Object} req : The request object including body for employee details.
 * @param {Object} res : The response object to send back the creation status and new employee details.
 * @return {Object} : Status message indicating the result of the creation operation and new employee details.
 */
const createEmployee = async (req, res) => {
    try {
        const { fullName, email, dob, joiningDate, address } = req.body;

        const newEmployee = await dbService.create(Employee, {
            fullName,
            email,
            dob,
            joiningDate,
            address,
        });

        if (!newEmployee) {
            return res.status(400).json({
                status: "error",
                message: "Something went wrong, Employee not created.",
            });
        }

        return res.status(201).json({
            status: "success",
            newEmployee,
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Get all employees with pagination.
 * @param {Object} req : The request object.
 * @param {Object} res : The response object to send back the list of employees.
 * @return {Object} : List of employees with pagination information.
 */


const getAllEmployees = async (req, res) => {
    try {
        // Extract page and limit from query parameters, set default values if not provided
        const page = parseInt(req.query.page) || 1; // Current page
        const limit = parseInt(req.query.limit) || 10; // Items per page

        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        // Fetch the employees with pagination
        const employees = await Employee.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip) // Skip the previous pages
            .limit(limit); // Limit to the specified number of items

        // Get the total number of employees for pagination info
        const totalEmployees = await Employee.countDocuments(); // Total count of employees

        // Check if no employees were found
        if (!employees.length) {
            return res.status(404).json({ status: "error", message: "No employees found." });
        }

        // Create pagination data
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalEmployees / limit),
            totalItems: totalEmployees,
            itemsPerPage: limit,
        };

        return res.status(200).json({
            status: "success",
            data: {
                employees,
                pagination,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};


/**
 * @description : Get a single employee by ID.
 * @param {Object} req : The request object including employee ID.
 * @param {Object} res : The response object to send back the employee details.
 * @return {Object} : Employee details.
 */
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                status: "error",
                message: "Employee not found.",
            });
        }

        return res.status(200).json({
            status: "success",
            data: employee,
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Update an employee by ID.
 * @param {Object} req : The request object including employee ID and updated details.
 * @param {Object} res : The response object to send back the updated employee details.
 * @return {Object} : Updated employee details.
 */
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!employee) {
            return res.status(404).json({
                status: "error",
                message: "Employee not found.",
            });
        }

        return res.status(200).json({
            status: "success",
            data: employee,
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * @description : Delete an employee by ID.
 * @param {Object} req : The request object including employee ID.
 * @param {Object} res : The response object to send back the deletion status.
 * @return {Object} : Status message indicating the result of the deletion operation.
 */
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                status: "error",
                message: "Employee not found.",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Employee deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};
