const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schedule = require('./schedule');

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
            index: true
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

tagSchema.pre("deleteOne", async function(next) {
    const {_id} = this.getFilter();
    await schedule.updateMany({tagId: {$in: _id}}, {
        $pullAll: {tagId: [_id]}
    });
    next();
})

module.exports = mongoose.model('tag', tagSchema);