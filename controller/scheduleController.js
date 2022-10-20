const schedule = require('../models/schedule');
const category = require('../models/category');
const tagController = require('./tagController');
const {addWeeks} = require("../public/javascripts/calendar/fullCalendar/main");

module.exports = {
    mySchedule: async (memberId) =>{
        try {
            return await schedule.find({memberId: memberId});
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
                    tagId: newTags
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
            let authMemberId = []
            let authSchedule = await category.find({shareMemberId: {$in: memberId}}).select('memberId');

            authSchedule.map((data) => {
                authMemberId.push(data.memberId)
            });

            let shareSchedule = await category.find({shareMemberId: {$in: memberId}}).populate({
                path: 'tagId',
                populate: {
                    path: 'scheduleId',
                    match: {memberId: {$in: authMemberId}}
                }
            })

            let allSchedule = [];

            scheduleData.map((data) => {
                allSchedule.push({
                    category: '',
                    scheduleData: data,
                })
            })

            await Promise.all(
                shareSchedule.map((shareData) => {
                    shareData.tagId.map((tagData) => {
                        tagData.scheduleId.map((scheduleData) => {
                            let flag = allSchedule.find(value => value.scheduleData === scheduleData);
                            if (!flag) {
                                allSchedule.push({
                                    category: shareData.name,
                                    scheduleData: scheduleData,
                                })
                            }
                        })
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
    }
}