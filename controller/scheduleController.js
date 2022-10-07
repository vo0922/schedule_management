const schedule = require('../models/schedule');
const tagController = require('./tagController');

module.exports = {
    created: async (schedules, memberId) => {
        let newSchedule = new schedule({
            startDate: schedules.startDate,
            endDate: schedules.endDate,
            title: schedules.title,
            content: schedules.content,
            priority: schedules.priority,
            map: schedules.map,
            memberId: memberId,
            tagId:[]
        })
        try {
            await newSchedule.save()
            let newTag = []
            await Promise.all(schedules.tags.map(async (data) => {
                const tagData = await tagController.created(data, memberId, newSchedule._id);
                newTag.push(tagData._id);
            }))
            return await schedule.findOneAndUpdate({_id: newSchedule._id}, {$set:{tagId: newTag}});
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
            return await leftScheduleData.updateOne({$set: {tagId: newTags}});
        } catch (e) {
            throw new Error(e);
        }
    },
    deleted: async (schedules) => {
        try {
            return await schedules.deleteOne({_id: schedules});
        } catch (e) {
            throw new Error(e);
        }
    }
}