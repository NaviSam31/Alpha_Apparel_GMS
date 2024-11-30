import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    fname: String,
    emaill: String,
    idnumber: { type: String, required: true, unique: true },
    join_date: Date,
    designation: String,
    department: String,
    basic_salary: Number,
    allowance: Number,
    skill_level: String,
    doc1: {
        data: Buffer,
        contentType: String
    },
    doc2: {
        data: Buffer,
        contentType: String
    },
    doc3: {
        data: Buffer,
        contentType: String
    },
    doc4: {
        data: Buffer,
        contentType: String
    }

}, {
    timestamps: true,
});

export const itemmodel = mongoose.model('Employee', employeeSchema);
