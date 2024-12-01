const mongoose = require("mongoose");
// initial
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    dueDate: {
        type: Date,
    },
    type: {
        type: String,
        enum: ["follow_by", "general"],
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: String
    },
    relatedClient: {
        type: String 
    },
},
    { 
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);
