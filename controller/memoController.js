const memo = require('../models/memo')

module.exports = {
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
    memoReaded: async (memberId) => {
        try {
            return await memo.find({memberId: memberId}).populate('schedule');
        } catch (e) {
            throw new Error(e)
        }
    },
    memoDelete: async (memoId) => {
        try {
            return await memo.deleteOne({_id: memoId});
        } catch (e) {
            throw new Error(e)
        }
    },
    memoFind: async (memoId) => {
        try {
            return await memo.findOne({_id: memoId}).populate('schedule')
        } catch (e) {
            throw new Error(e)
        }
    },
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