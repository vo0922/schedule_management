const memo = require('../models/memo')

module.exports = {
    memoInsert: async (memberId, content, scheduleId) => {
        try{
            const memoData = new memo({
                content: content,
                memberId: memberId,
                schedule: scheduleId
            })
            const InsertMemo = await memoData.save();

            return InsertMemo
        }catch(e){
            throw new Error(e)
        }
    },
    memoReaded: async (memberId) => {
        try{
            return await memo.find({memberId: memberId});
        }catch(e){
            throw new Error(e)
        }
    },
    memoDelete: async (memoId) => {
        try{
           return await memo.deleteOne({_id: memoId});
        }catch(e){
            throw new Error(e)
        }
    }
}