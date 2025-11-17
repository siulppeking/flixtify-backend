const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true,
            trim: true 
        },
        description: { 
            type: String, 
            trim: true 
        },
        // CLAVE: Referencia al proyecto contenedor
        projectId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Project', 
            required: true 
        }, 
        // ELIMINADO: assignedTo 
        priority: { 
            type: String, 
            enum: ['Low', 'Medium', 'High'], 
            default: 'Medium' 
        },
        status: { 
            type: String, 
            enum: ['To Do', 'In Progress', 'Done'], 
            default: 'To Do' 
        },
        dueDate: { 
            type: Date 
        },
    }, 
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model("Task", TaskSchema);