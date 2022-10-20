
const category = require('../models/category')
const schedule = require("../models/schedule");

module.exports = {
    findOne: async (categoryId) => {
        try {
            const categoryData = await category.findOne({_id: categoryId}).populate('tagId').populate('shareMemberId');
            return await categoryData;
        } catch (e) {
            throw new Error(e)
        }
    },
    findMy: async (memberId) => {
        try {
            const myCategory = await category.find({memberId: memberId})
            return await myCategory;
        } catch (e) {
            throw new Error(e)
        }
    },
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
            let exCategory = await category.findOne({_id: categories._id});
            if(!exCategory){
                throw new Error()
            }
            return await category.findOneAndUpdate({_id: exCategory._id}, {
                $set:{
                    name: categories.name,
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
    },
    shareCategory: async (memberId) => {
        try {
            let shareCategory = await category.find({shareMemberId:{$in:memberId}}).populate('tagId').populate('memberId');
            let categoryData = []
            shareCategory.map((data)=> {
                let flag = categoryData.findIndex(value=>value.memberId===data.memberId);
                if(!(flag == -1)){
                    categoryData[flag].categoryId.push(data);
                }else{
                    categoryData.push({
                        memberId:data.memberId,
                        categoryId:[data],
                    })
                }
            })

            return categoryData;
        }catch (e){
            throw new Error(e)
        }
    },
    shareSchedule: async (categoryId, authMemberId) => {
        try {
            let shareSchedule =  await category.findOne({_id: categoryId}).populate({
                path: 'tagId',
                populate: {
                    path: 'scheduleId',
                    match:{memberId:authMemberId}
                }
            })
            let shareScheduleData = [];
            shareSchedule.tagId.map((data) => {
                data.scheduleId.map((scheduleData) => {
                    let flag = shareScheduleData.find(value => value.scheduleData === scheduleData);
                    if (!flag) {
                        shareScheduleData.push({
                            category: shareSchedule.name,
                            scheduleData: scheduleData,
                        })
                    }
                })
            })
            return shareScheduleData;
        } catch (e) {
            throw new Error(e)
        }
    },
    shareAllSchedule: async(memberId) => {
        try {
            let authSchedule = await category.find({shareMemberId: {$in: memberId}});
            let shareAllSchedule = [];
            await Promise.all(authSchedule.map(async (authScheduleData) => {
                    let shareSchedule = await schedule.find({
                        tagId: {$in: authScheduleData.tagId},
                        memberId: authScheduleData.memberId
                    })
                    shareSchedule.map((shareScheduleData) => {
                        let flag = shareAllSchedule.find(value => value.scheduleData === shareScheduleData);
                        if (!flag) {
                            shareAllSchedule.push({
                                category: authSchedule.name,
                                scheduleData: shareScheduleData,
                            })
                        }
                    })
                })
            )
            return shareAllSchedule;
        } catch (e) {
            throw new Error(e)
        }
    }
}