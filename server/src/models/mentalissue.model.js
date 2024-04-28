const mongoose = require('mongoose');

const mentalissueSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    mentalissue: {
        type: String,
        required: true
    }
});

const MentalIssue = mongoose.model('MentalIssue', mentalissueSchema);

module.exports = MentalIssue;
