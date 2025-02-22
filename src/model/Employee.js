/**
 * Employee.js
 * @description :: model of a database collection employee
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { Schema } = mongoose;

const myCustomLabels = {
    totalDocs: "itemCount",
    docs: "data",
    limit: "perPage",
    page: "currentPage",
    nextPage: "next",
    prevPage: "prev",
    totalPages: "pageCount",
    pagingCounter: "slNo",
    meta: "paginator",
};

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const schema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "Invalid email address",
            },
        },
        dob: {
            type: Date, // Changed to Date for better validation and storage
            required: true
        },
        joiningDate: {
            type: Date,
            default: Date.now // Automatically sets the joining date to the current date if not provided
        },
        address: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

// Removing unnecessary pre-save hooks and methods

schema.method("toJSON", function () {
    const { _id, __v, ...object } = this.toObject({ virtuals: true });
    object.id = _id;

    return object;
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const Employee = mongoose.model("Employee", schema);
module.exports = Employee;
