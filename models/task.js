const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,         // Specify the type of the field
        required: true,
        unique: true
    },
    desc: {
        type: String,         // Specify the type of the field
        required: true,
        unique: true
    },
    important: {
        type: Boolean,        // Specify the type of the field
        default: false
    },
    completed: {
        type: Boolean,        // Specify the type of the field
        default: false
    }
});

module.exports = mongoose.model("Task", TaskSchema);  // Capitalize the model name for convention
