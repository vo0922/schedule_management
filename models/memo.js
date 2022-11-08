const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모 모델
 * 주요 기능 : 메모 스키마 설계
 */
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