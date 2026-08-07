const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    fullName:          { type: String, required: true, trim: true },
    course:            { type: String, required: true }, // VD: "Fullstack Web K72"
    industry:          { type: String, enum: ['Code', 'Data Analysis', 'Business Analysis'], required: true },
    skills:            { type: [String], default: [] },
    preferredLocation: { type: String, enum: ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'], required: true },
    expectedSalary:    { type: String, default: 'Thỏa thuận' },
    cvLink:            { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Student', studentSchema);
