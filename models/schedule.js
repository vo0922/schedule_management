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
            index: true
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정이 삭제될 경우 삭제되기전 연관된 태그들의 매핑관계를 끊어주고 메모와 매핑되어있는 일정 매핑관계 해제 하는 함수
 * 주요 기능 : 일정이 삭제될때 각태그들과 연관된 일정 매핑관계를 끊어주고 각태그의 사용횟수를 1씩 차감
 * 메모와 매핑되어있는 일정을 삭제
 */
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