const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoSchema = new Schema({
    content:
        {
            type:String,
        },
    memberId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'member',
            require: true
        },
    schedule:
        [{
            type:mongoose.Schema.Types.ObjectId,
            ref:'schedule'
        }],
    date:
        {
            type:Date,
            default: new Date()
        }
}, {versionKey: false})


module.exports = mongoose.model('memo', memoSchema);