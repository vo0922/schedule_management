const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 담당자 : 박신욱
 * 함수 설명 : tag 모델
 * 주요 기능 : tag 스키마 설계
 */
const tagSchema = new Schema({
    name:
        {
            type: String,
            unique: true,
            required: true,
        },
    memberId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "member",
            required: true,
        },
    click:
        {
            type: Number,
            required: true,
            default: 0,
        },
    scheduleId:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "schedule",
        }],
}, {versionKey: false})


module.exports = mongoose.model('tag', tagSchema);