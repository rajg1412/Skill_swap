const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    duration: { type: Number, default: 60 } // in minutes
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
