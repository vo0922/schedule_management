const tag = require('../models/tag');

module.exports = {
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
    created: async (name, memberId, scheduleId) => {
        let tagData = {
            name: name,
            memberId: memberId,
            click: 0,
            scheduleId: scheduleId,
        }
        const exTag = await tag.findOne({name: tagData.name})
        try {
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
    editCreated: async (scheduleId) => {
        try {
            await tag.updateMany({scheduleId: {$in: scheduleId}}, {
                $pullAll: {scheduleId: [scheduleId]}
            });
        } catch (e) {
            throw new Error(e);
        }
    },
    updated: async (name, tagId) => {
        try {
            return await tag.updateOne({_id: tagId}, {
                name: name
            })
        } catch (e) {
            throw new Error(e);
        }
    },
    deleted: async (tagId) => {
        try {
            return await tag.deleteOne({_id: tagId});
        } catch (e) {
            throw new Error(e);
        }
    },
    selectChange: async (text) => {
        try {
            return await tag.find({name: {$regex: text}});
        } catch (e) {
            throw new Error(e);
        }
    }
}