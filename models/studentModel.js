const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gpa: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true // Bật tính năng timestamps
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
