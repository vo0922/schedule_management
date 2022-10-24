const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 모델
 * 주요 기능 : 카테고리 스키마 설계
 */
const categorySchema = new Schema({
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
    shareCheck:
        {
            type: Boolean,
            required: true,
            default: 0,
        },
    tagId:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag",
        }],
    shareMemberId:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "member",
            required: true,
        }],
    color:
        {
            type:String
        }
}, {versionKey: false})


module.exports = mongoose.model('category', categorySchema);