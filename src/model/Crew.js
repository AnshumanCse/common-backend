/**
 * Crew.js
 * @description :: Model for crew members (drivers & conductors).
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { Schema } = mongoose;

const crewSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["Driver", "Conductor"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

crewSchema.plugin(mongoosePaginate);
crewSchema.plugin(idValidator);

const Crew = mongoose.model("Crew", crewSchema);
module.exports = Crew;
