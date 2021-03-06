const mongoose = require('mongoose');
const User = require('./user');

// Student extra
const ProfessorSpecificSchema = mongoose.Schema({
    /*courses: {
        type: [String],
        required: true
    },
    year: {
        type: [String],
        required: false
    },
    grades: {
        type: [String],
        required: false
    },
    resume: {
        type: String,
        required: false
    }*/
});

const Student = module.exports = User.discriminator('Professor', ProfessorSpecificSchema);
