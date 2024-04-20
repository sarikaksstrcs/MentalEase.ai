const mongoose = require('mongoose');

const userIssuesSchema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    issues: [{
        issueFaced: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const UserIssues = mongoose.model('UserIssues', userIssuesSchema);

module.exports = UserIssues;