const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 모델
 * 주요 기능 : 일정 스키마 설계
 */
const scheduleSchema = new Schema({
    startDate:
        {
            type: Date,
            required: true,
        },
    endDate:
        {
            type: Date,
            required: true,
        },
    title:
        {
            type: String,
            default: '',
        },
    content:
        {
            type: String,
            default: '',
        },
    priority:
        {
            type: Number,
            default: 0,
        },
    address:
        {
            type: String,
            default: ''
        },
    memberId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "member",
            required: true,
        },
    tagId:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag",
            required: true,
        }],
}, {versionKey: false})


module.exports = mongoose.model('schedule', scheduleSchema);