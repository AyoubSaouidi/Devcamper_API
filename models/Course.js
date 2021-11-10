// Mongoose
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please a description']
    },
    weeks: {
        type: Number,
        required: [true, 'Please a number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

CourseSchema.statics.getAverageCost = async function(bootcampId) {
    // Create Aggregation
    const aggregation = await this.aggregate([{
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    // Save AverageCost field in Bootcamp
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(aggregation[0].averageCost / 10) * 10
        });
    } catch (err) {
        console.log(err.message.red.bold);
    }
};

// Re-calculate Average Cost of Bootcamp tuition - ON SAVE
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});
// Re-calculate Average Cost of Bootcamp tuition - ON DELETE
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);