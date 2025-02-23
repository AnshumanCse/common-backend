// /**
//  * Duty.js
//  * @description :: Model for duty assignments.
//  */

// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");
// const idValidator = require("mongoose-id-validator");
// const { Schema } = mongoose;

// const dutySchema = new Schema(
//     {
//         date: {
//             type: Date,
//             required: true
//         },
//         vehicleId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Vehicle",
//             required: true
//         },
//         driverId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Crew",
//             required: true
//         },
//         conductorId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Crew",
//             required: true
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // Ensure a vehicle, driver, and conductor are assigned only once per day
// dutySchema.index({ date: 1, vehicleId: 1 }, { unique: true });
// dutySchema.index({ date: 1, driverId: 1 }, { unique: true });
// dutySchema.index({ date: 1, conductorId: 1 }, { unique: true });

// dutySchema.plugin(mongoosePaginate);
// dutySchema.plugin(idValidator);

// const Duty = mongoose.model("Duty", dutySchema);
// module.exports = Duty;



/**
 * Duty.js
 * @description :: Model for duty assignments.
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { Schema } = mongoose;

const dutySchema = new Schema(
    {
        date: {
            type: Date,
            required: true
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crew",
            required: true
        },
        conductorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crew",
            required: true
        },
        startTime: {
            type: String, //================ Format: "HH:mm"
            required: true,
            validate: {
                validator: function (v) {
                    return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v); // ==================== Validates time format HH:mm
                },
                message: "Start time must be in HH:mm format (e.g., 08:30, 14:45)."
            }
        },
        duration: {
            hours: {
                type: Number,
                required: true,
                min: [0, "Hours cannot be negative."],
                max: [24, "Hours cannot exceed 24."]
            },
            minutes: {
                type: Number,
                required: true,
                min: [0, "Minutes cannot be negative."],
                max: [59, "Minutes cannot exceed 59."]
            }
        }
    },
    {
        timestamps: true
    }
);

// Ensure a vehicle, driver, and conductor are assigned only once per day
dutySchema.index({ date: 1, vehicleId: 1 }, { unique: true });
dutySchema.index({ date: 1, driverId: 1 }, { unique: true });
dutySchema.index({ date: 1, conductorId: 1 }, { unique: true });

dutySchema.plugin(mongoosePaginate);
dutySchema.plugin(idValidator);

const Duty = mongoose.model("Duty", dutySchema);
module.exports = Duty;
