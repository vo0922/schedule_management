const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schedule = require('./schedule');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 모델
 * 주요 기능 : 태그 스키마 설계
 */
const tagSchema = new Schema({
    // _id보다 일정 이름으로 검색이 많이 이루어짐으로 태그 이름에 인덱스 설정
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그가 삭제될경우 삭제되기전 일정에 매핑되어있는 태그들의 연관관계 제거 하는 함수
 * 주요 기능 : 태그가 삭제되기전 일정의 태그 매핑관계 해제
 */
tagSchema.pre("deleteOne", async function(next) {
    const {_id} = this.getFilter();
    await schedule.updateMany({tagId: {$in: _id}}, {
        $pullAll: {tagId: [_id]}
    });
    next();
})

module.exports = mongoose.model('tag', tagSchema);