import mongoose from 'mongoose';


const Trainchema = mongoose.Schema({
    usersname: String,
    trainname: String,
    description: String,
    sheduleDate: String,
    sheduleTime: String,
    releventDepartment: String,
    options: String,

}, {
    timestamps: true

})


export const Train = mongoose.model('Trainers', Trainchema);