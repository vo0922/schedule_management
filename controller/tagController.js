const tag = require('../models/tag')

module.exports = {
    created: async (name, memberId, scheduleId, res) => {
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
                    click: 0,
                    scheduleId: tagData.scheduleId
                })
                await newTag.save();
                return newTag
            } else {
                const updateTag = await tag.findOneAndUpdate({name: tagData.name}, {
                    $push: {scheduleId: tagData.scheduleId}
                });
                return updateTag;
            }
        } catch (e) {
            res.status(401).json({message: e});
        }
    },
    editCreated: async (name, memberId, scheduleId, res) => {
    
    }
}