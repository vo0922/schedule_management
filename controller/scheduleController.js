const schedule = require('../models/schedule');
const category = require('../models/category');
const tagController = require('./tagController');

module.exports = {
    mySchedule: async (memberId) => {
        try {
            return await schedule.find({memberId: memberId}).populate('tagId');
        } catch (e) {
            throw new Error(e);
        }
    },
    myScheduleSearch: async (memberId, text) => {
        try {
            return await schedule.find({
                memberId: memberId,
                title: {$regex: text}
            }).populate('tagId');
        } catch (e) {
            throw new Error(e);
        }
    },
    created: async (schedules, memberId) => {
        let newSchedule = new schedule({
            startDate: schedules.startDate,
            endDate: schedules.endDate,
            title: schedules.title,
            content: schedules.content,
            priority: schedules.priority,
            map: schedules.map,
            memberId: memberId,
            tagId: []
        })
        try {
            await newSchedule.save()
            let newTag = []
            await Promise.all(schedules.tags.map(async (data) => {
                const tagData = await tagController.created(data, memberId, newSchedule._id);
                newTag.push(tagData._id);
            }))
            return await schedule.findOneAndUpdate({_id: newSchedule._id}, {$set: {tagId: newTag}});
        } catch (e) {
            throw new Error(e);
        }
    },
    updated: async (schedules, memberId) => {
        try {
            let leftScheduleData = await schedule.findOne({_id: schedules._id});
            await tagController.editCreated(leftScheduleData._id);
            let newTags = [];
            await Promise.all(schedules.tags.map(async (data) => {
                const tagData = await tagController.created(data, memberId, leftScheduleData._id);
                newTags.push(tagData._id)
            }))
            return await leftScheduleData.updateOne({
                $set: {
                    startDate: schedules.startDate,
                    endDate: schedules.endDate,
                    title: schedules.title,
                    content: schedules.content,
                    priority: schedules.priority,
                    map: schedules.map,
                    tagId: newTags,
                    completion: schedules.completion
                }
            });
        } catch (e) {
            throw new Error(e);
        }
    },
    deleted: async (schedules) => {
        try {
            return await schedule.deleteOne({_id: schedules});
        } catch (e) {
            throw new Error(e);
        }
    },
    scheduleCalendar: async (memberId) => {
        try {
            const scheduleData = await schedule.find({memberId: memberId});

            let authSchedule = await category.find({shareMemberId: {$in: memberId}});

            let allSchedule = [];

            scheduleData.map((data) => {
                allSchedule.push({
                    category: '',
                    scheduleData: data,
                })
            })

            await Promise.all(authSchedule.map(async (authScheduleData) => {
                    let shareSchedule = await schedule.find({
                        tagId: {$in: authScheduleData.tagId},
                        memberId: authScheduleData.memberId
                    })
                    shareSchedule.map((shareScheduleData) => {
                        let flag = allSchedule.find(value => JSON.stringify(value.scheduleData._id) === JSON.stringify(shareScheduleData._id));
                        if (!flag) {
                            allSchedule.push({
                                category: authScheduleData.color,
                                scheduleData: shareScheduleData,
                            })
                        }
                    })
                })
            )

            return allSchedule
        } catch (e) {
            throw new Error(e);
        }
    },
    readed: async (scheduleId) => {
        try {
            const scheduleData = await schedule.findOne({_id: scheduleId}).populate('memberId').populate('tagId');
            return scheduleData;
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 이승현, 박신욱
     * 함수 설명 : 태그 통계 API
     * 주요 기능 : 총 일정 갯수와 태그 사용 횟수를 세어 주는 기능입니다. 
     */
    totalTag: async (memberId) => {
        try {
            // member가 작성한 일정에 포함된 태그 정보들을 불러와라.
            const tagName = await schedule.find({memberId: memberId}).populate('tagId')
            let totalTag = []
            tagName.map((schedule) => {
                schedule.tagId.map((tagData) => {
                    // flag는 조건을 걸고 싶을 때 사용
                    let flag = totalTag.findIndex(value => value.tag._id === tagData._id);
                    if (flag == -1) {
                        totalTag.push({
                            tag: tagData,
                            count: 1,
                        })
                    } else {
                        totalTag[flag].count += 1
                    }
                })
            })
            return totalTag;
        } catch (e) {
            throw new Error(e);
        }
    },
    todaySchedule: async (memberId) => {
        try {
            let today = new Date();
            let startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
            let endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

            const todaySchedule = await schedule.find({
                memberId: memberId,
                startDate: {$lte: startToday},
                endDate: {$gte: endToday}
            });

            return todaySchedule;
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 이승현
     * 함수 설명 : 태그에 포함된 일정 목록 API
     * 주요 기능 : 태그 차트에서 태그 항목을 선택(클릭) 시 선택된 태그 항목이 포함된 일정 목록을 보여줍니다.
     */
    tagAboutSchedule: async (memberId) => {
        try {
            const tagAboutScheduleData = await schedule.find({memberId: memberId}).populate('tagId')
            return tagAboutScheduleData
        } catch (e) {
            throw new Error(e)
        }
    },

    /**
     * 담당자 : 이승현
     * 함수 설명 : 일정 진행도(진행/완료) API
     * 주요 기능 : 대시보드에서 일정 진행도 상태를 동적으로 변경하고.
     *            그에 따른 오늘 일정 완료율 또한 변동됩니다.
     */
    scheduleProgress: async (scheduleId, progress) => {
        try {
            const scheduleData = await schedule.findOneAndUpdate({_id: scheduleId}, {
                $set :{
                    completion: progress
            }
        },{new: true})  // update된 이후의 데이터를 받아오기 위해서 {new: true}를 적어준다.
        return scheduleData

        } catch (e) {
            throw new Error(e)
        }
    }
}