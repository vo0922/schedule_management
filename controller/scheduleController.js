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
            const scheduleData = await schedule.findOne({_id: scheduleId}).populate('tagId');
            return scheduleData;
        } catch (e) {
            throw new Error(e);
        }
    },
    totalTag: async (memberId) => {
        try {
            const tagName = await schedule.find({memberId: memberId}).populate('tagId')
            let totalTag = []
            tagName.map((schedule) => {
                schedule.tagId.map((tagData) => {
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
    tagAboutSchedule: async (memberId) => {
        try {
            const tagAboutScheduleData = await schedule.find({memberId: memberId}).populate('tagId')
            return tagAboutScheduleData
        } catch (e) {
            throw new Error(e)
        }
    },// 일정 진행도(진행/완료)
    scheduleProgress: async (scheduleId, progress) => {
        try {
            const scheduleData = await schedule.findOneAndUpdate({_id: scheduleId}, {
                $set :{
                    completion: progress
            }
        },{new: true})
        return scheduleData

        } catch (e) {
            throw new Error(e)
        }
    }
}