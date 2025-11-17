const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        // CLAVE: Referencia al dueño del proyecto (usuario autenticado)
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        startDate: {
            type: Date
        },
        dueDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Active', 'On Hold', 'Completed'],
            default: 'Active'
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", ProjectSchema);