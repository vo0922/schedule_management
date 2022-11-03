const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tag = require('./tag');
const memo = require('./memo');

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
    map:
        {
            title: {
                type: String
            },
            address: {
                type: String
            },
            x: {
                type: String
            },
            y: {
                type: String
            }
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
    completion:
        {
            type: Boolean,
            default: false
        }
}, {versionKey: false})

scheduleSchema.pre("deleteOne", async function (next) {
    const {_id} = this.getFilter();
    await tag.updateMany({scheduleId: {$in: _id}}, {
        $pullAll: {scheduleId: [_id]},
        $inc: {
            click: -1
        }
    });
    await memo.updateMany({schedule:{$in:_id}},{
        $pullAll: {schedule: [_id]},
    })
    next();
})

module.exports = mongoose.model('schedule', scheduleSchema);