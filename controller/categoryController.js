const category = require('../models/category')

module.exports = {
    created: async (categories, memberId) => {
        try {
            const newCategory = new category({
                name: categories.name,
                memberId: memberId,
                shareCheck: categories.shareCheck,
                tagId: categories.tagIds,
                shareMemberId: categories.shareMemberIds
            });
            return await newCategory.save();
        } catch (e) {
            throw new Error(e)
        }
    },
    updated: async (categories) => {
        try {
            let exCategory = await category.findOne({_id: categories});
            if(!exCategory){
                throw new Error()
            }
            await category.findOneAndUpdate({_id: exCategory._id}, {
                $set:{
                    shareCheck: categories.shareCheck,
                    tagId: categories.tagIds,
                    shareMemberId: categories.shareMemberIds
                }
            }, {new: true});
        } catch (e) {
            throw new Error(e)
        }
    },
    deleted: async (categoryId) => {
        try {
            return await category.deleteOne({_id: categoryId});
        }catch (e) {
            throw new Error(e)
        }
    }
}