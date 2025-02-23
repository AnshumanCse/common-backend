/**
 * Vehicle.js
 * @description :: Model for vehicles.
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { Schema } = mongoose;

const vehicleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,

        },
        vehicleNumber: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            enum: ["Bus", "Truck", "Car", "Van", "Motorcycle"],

        },

    },
    {
        timestamps: true
    }
);

vehicleSchema.plugin(mongoosePaginate);
vehicleSchema.plugin(idValidator);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
