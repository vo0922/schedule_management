const schedule = require('../models/schedule');
const tagController = require('./tagController');

module.exports = {
    created: async (schedules, memberId, res) => {
        const newSchedule = new schedule({
            startDate: schedules.startDate,
            endDate: schedules.endDate,
            title: schedules.title,
            content: schedules.content,
            priority: schedules.priority,
            address: schedules.address,
            memberId: memberId,
            tagId: [],
        });
        try {
            schedules.tags.map(async (data) => {
                const tagData = await tagController.created(data, memberId, newSchedule._id);
                await newSchedule.update({$push: {tagId: tagData._id}});
            })
            return await newSchedule.save()
        } catch (e) {
            res.status(401).json({message: e});
        }
    },
    updated: async (schedules, memberId, res) => {
        try {
            let leftScheduleData = await schedules.findOne({_id: schedules._id});
            let tagsId = [];
            schedules.tags.map(async (data) => {
                const tagData = await tagController.editCreated(data, memberId, leftScheduleData._id);
                tagsId.push(tagData._id);
            })
            await leftScheduleData.update({$set: tagsId});
            return leftScheduleData;
        } catch (e) {
            res.status(401).json({message: e});
        }
    }
}