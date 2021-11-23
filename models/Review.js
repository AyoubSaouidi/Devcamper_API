// Mongoose
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please a text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
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

// Prevent user from submitting more than one Review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function(bootcampId) {
    // Create Aggregation
    const aggregation = await this.aggregate([{
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    // Save averageRating field in Bootcamp
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: aggregation[0].averageRating
        });
    } catch (err) {
        console.error(err.message.red.bold);
    }
};

// Re-calculate Average Rating of Bootcamp tuition - ON SAVE
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.bootcamp);
});

// Re-calculate Average Rating of Bootcamp tuition - ON DELETE
ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);