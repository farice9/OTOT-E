import mongoose from 'mongoose';
var Schema = mongoose.Schema
let WorkoutSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: { values: ['cardio', 'strength'], message: "Workout type must be cardio / strength"},
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: [0, "Duration cannot be negative"],
        max: [1440, "Duration cannot exceed a day"]
    },
    description: {
        type: String,
        required: true
    }
})

export default mongoose.model('WorkoutModel', WorkoutSchema)
