const tag = require('../models/tag');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 태그 모델을 컨트롤 하는 함수
 */
module.exports = {
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 태그이름으로 매핑되어있는 유저의 일정을 같이 반환 하는 함수
     * 주요 기능 : 태그이름을 조건으로 유저 _id매치로 유저 태그와 일정 반환
     */
    findNameAndSchedule: async (name, memberId) => {
        try {
            return await tag.findOne({name: name}).populate({
                path: 'scheduleId',
                match: {memberId: memberId},
                populate: {
                    path: 'tagId',
                }
            })
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 여러가지의 태그이름으로 유저 일정을 같이 반환하는 함수
     * 주요 기능 : 태그이름을 포함하는 조건으로 유저 _id매치로 유저 태그와 일정 반환
     */
    findManyNameAndSchedule: async (names, memberId) => {
        try {
            return await tag.find({name: {$in : names}}).populate({
                path: 'scheduleId',
                match: {memberId: memberId},
                populate: {
                    path: 'tagId',
                }
            })
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 태그를 생성하는 함수
     * 주요 기능 : 생성될 태그 데이터들을 받아와 태그 존재여부를 통해 생성된 태그 및 기존 태그 반환
     */
    created: async (name, memberId, scheduleId) => {
        let tagData = {
            name: name,
            memberId: memberId,
            click: 0,
            scheduleId: scheduleId,
        }
        const exTag = await tag.findOne({name: tagData.name})
        try {
            // 태그 존재 여부 판단으로 존재하지 않다면 태그의 사용횟수를 1로두고 태그 생성
            if (!exTag) {
                const newTag = new tag({
                    name: tagData.name,
                    memberId: tagData.memberId,
                    click: 1,
                    scheduleId: tagData.scheduleId
                })
                await newTag.save();
                return newTag
            } else {
                // 기존에 존재하던 태그일경우 새롭게추가되는 일정과 매핑 후 태그와 매핑되어있는 일정 갯수만큼 태그의 사용횟수 수정
                const updateTag = await tag.findOneAndUpdate({name: tagData.name}, {
                    $push: {scheduleId: tagData.scheduleId}
                }, {new: true});
                await tag.updateOne({_id: updateTag._id}, {click: updateTag.scheduleId.length});
                return updateTag;
            }
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 수정될 일정과 매핑되어있던 태그들에 수정전의 일정의 매핑관계를 끊어주는 함수
     * 주요 기능 : 수정될 일정 _id를 포함하는 태그들에 수정전의 일정매핑관계 제거
     */
    editCreated: async (scheduleId) => {
        try {
            await tag.updateMany({scheduleId: {$in: scheduleId}}, {
                $pullAll: {scheduleId: [scheduleId]}
            });
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 태그의 이름을 수정할 함수
     * 주요 기능 : 태그의 이름을 request받아 태그 이름 수정
     */
    updated: async (name, tagId) => {
        try {
            return await tag.updateOne({_id: tagId}, {
                name: name
            })
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 기존의 태그를 삭제하는 함수
     * 주요 기능 : 태그 _id를 조건으로 태그 삭제
     */
    deleted: async (tagId) => {
        try {
            return await tag.deleteOne({_id: tagId});
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 태그 이름을통해 검색하기위한 함수
     * 주요 기능 : 태그를 %이름% 을 조건으로 태그 검색하는 기능
     */
    selectChange: async (text) => {
        try {
            return await tag.find({name: {$regex: text}});
        } catch (e) {
            throw new Error(e);
        }
    }
}