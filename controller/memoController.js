const memo = require('../models/memo')

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모 모델을 컨트롤 하는 함수
 */
module.exports = {
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 메모를 추가하는 함수
     * 주요 기능 : 메모 데이터와 일정 데이터를 통해 새로운 메모 데이터 객체를 생성후 저장
     */
    memoInsert: async (memberId, content, scheduleId) => {
        try {
            const memoData = new memo({
                content: content,
                memberId: memberId,
                schedule: scheduleId,
                date: new Date(),
            })
            const InsertMemo = await memoData.save();

            return InsertMemo
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저의 모든 메모를 반환 하는 함수
     * 주요 기능 : 유저의 모든 메모 데이터를 매핑되어있는 일정데이터를 함께 반환 하는기능
     */
    memoReaded: async (memberId) => {
        try {
            return await memo.find({memberId: memberId}).populate('schedule');
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저의 메모를 삭제하는 함수
     * 주요 기능 : 유저의 메모를 삭제하는 기능
     */
    memoDelete: async (memoId) => {
        try {
            return await memo.deleteOne({_id: memoId});
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 하나의 일정의 상세 페이지데이터를 반환하는 함수
     * 주요 기능 : 유저 _id를 request받아 메모데이터를 매핑되어있는 일정과 함께 검색
     */
    memoFind: async (memoId) => {
        try {
            return await memo.findOne({_id: memoId}).populate('schedule')
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저의 메모를 수정하는 기능
     * 주요 기능 : 메모 데이터를 가져와 새롭게 메모 컨텐츠와 일정을 매핑후 변경된 메모데이터를 반환하는 함수
     */
    memoUpdate: async (memoData) => {
        try {
            return await memo.findOneAndUpdate({_id: memoData._id}, {
                $set: {
                    content: memoData.content,
                    schedule: memoData.schedules
                }
            },{new:true}).populate('schedule')
        } catch (e) {
            throw new Error(e)
        }
    }
}