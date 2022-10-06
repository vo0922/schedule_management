const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 사용자 모델
 * 주요 기능 : 사용자 스키마 설계
 */
const memberSchema = new Schema({
    email:
        {
            type: String,
            unique: true,
            required: true,
        },
    name:
        {
            type: String,
            required: true,
        },
    nickname:
        {
            type: String,
            required: true,
            default: " ",
        },
    profile:
        {
            type: String,
        },
    snsId:
        {
            type: String,
        },
    provider:
        {
            type: String,
        },
    headerColor:
        {
            type:String,
            default:'--header-color'
        }
}, {versionKey: false})


module.exports = mongoose.model('member', memberSchema);