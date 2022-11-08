const category = require('../models/category')
const schedule = require("../models/schedule");

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 모델을 컨트롤 하는 함수
 */
module.exports = {
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 카테고리 _id 값을 통해 카테고리 데이터를 가져오는 함수
     * 주요 기능 : 카테고리 _id를 조건으로 매핑되어있는 태그, 공유자 데이터를 함께 반환 하는 기능
     */
    findOne: async (categoryId) => {
        try {
            const categoryData = await category.findOne({_id: categoryId}).populate('tagId').populate('shareMemberId');
            return await categoryData;
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저 _id 값을 통해 카테고리 작성자 데이터를 가져오는 함수
     * 주요 기능 : 유저 _id를 조건으로 카테고리 데이터 반환 하는 기능
     */
    findMy: async (memberId) => {
        try {
            const myCategory = await category.find({memberId: memberId})
            return await myCategory;
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 카테고리를 생성하는 함수
     * 주요 기능 : request로 받은 데이터를 통해 새로운 카테고리 데이터를 생성후 저장하는 기능
     */
    created: async (categories, memberId) => {
        try {
            const newCategory = new category({
                name: categories.name,
                memberId: memberId,
                shareCheck: categories.shareCheck,
                tagId: categories.tagIds,
                shareMemberId: categories.shareMemberIds,
                color: categories.color
            });
            return await newCategory.save();
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 카테고리를 수정하는 함수
     * 주요 기능 : request로 받은 데이터를 통해 기존의 카테고리를 update한후 update된 카테고리 데이터를 반환하는 기능
     */
    updated: async (categories) => {
        try {
            let exCategory = await category.findOne({_id: categories._id});
            // 카테고리가 존재하지 않으면 Error를 리턴
            if(!exCategory){
                throw new Error()
            }
            return await category.findOneAndUpdate({_id: exCategory._id}, {
                $set:{
                    name: categories.name,
                    shareCheck: categories.shareCheck,
                    tagId: categories.tagIds,
                    shareMemberId: categories.shareMemberIds,
                    color: categories.color
                }
            }, {new: true});
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 카테고리를 삭제하는 함수
     * 주요 기능 : 카테고리 _id를 조건으로 카테고리를 삭제 하는 기능
     */
    deleted: async (categoryId) => {
        try {
            return await category.deleteOne({_id: categoryId});
        }catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저와 공유된 카테고리를 반환하는 함수
     * 주요 기능 : 공유된 유저 _id를 통해 검색된 카테고리를 한명의 작성자와 카테고리 배열 데이터를 객체 배열로 가공 후 데이터 반환 하는 기능
     */
    shareCategory: async (memberId) => {
        try {
            let shareCategory = await category.find({shareMemberId:{$in:memberId}}).populate('tagId').populate('memberId');
            // 가공할 데이터를 담을 배열
            let categoryData = []
            shareCategory.map((data)=> {
                // flag변수를 통해 작성자 Id 중복 체크 후 중복된 데이터일 경우 카테고리 데이터추가
                // 중복된 데이터가 아닐경우 categoryData변수에 새롭게 배열 추가
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
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 공유된 하나의 카테고리에 관한 일정을 가져오는 함수
     * 주요 기능 : 카테고리 _id 와 작성자 _id를 매게변수로 받아와 일정데이터와 카테고리 색상데이터를 가공하여 반환 하는 기능
     */
    shareSchedule: async (categoryId, authMemberId) => {
        try {
            // 카테고리에 매핑되어있는 태그를통해 일정데이터를 가져오는 기능
            let shareSchedule =  await category.findOne({_id: categoryId}).populate({
                path: 'tagId',
                populate: {
                    path: 'scheduleId',
                    match:{memberId:authMemberId}
                }
            })
            // 가져온 데이터를 카테고리 색상과 일정 으로 이루어진 객체 배열을 담기위한 변수
            let shareScheduleData = [];
            shareSchedule.tagId.map((data) => {
                data.scheduleId.map((scheduleData) => {
                    // flag변수를 통해 shareScheduleData에 중복된 일정을 체크 후 중복되지 않으면 shareScheduleData에 데이터 추가
                    let flag = shareScheduleData.find(value => value.scheduleData === scheduleData);
                    if (!flag) {
                        shareScheduleData.push({
                            category: shareSchedule.color,
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
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 공유된 모든 카테고리에 관한 일정을 가져오는 함수
     * 주요 기능 : 유저 _id를 매게변수로 받아와 일정데이터와 카테고리 색상데이터를 가공하여 반환 하는 기능
     */
    shareAllSchedule: async(memberId) => {
        try {
            let authSchedule = await category.find({shareMemberId: {$in: memberId}});
            // 카테고리 색상과 일정 데이터로 이루어진 객체 배열을 담기위한 변수
            let shareAllSchedule = [];
            await Promise.all(authSchedule.map(async (authScheduleData) => {
                // 가져온 카테고리 데이터에서 작성자와 일치한 일정 데이터를 가져오는 기능
                    let shareSchedule = await schedule.find({
                        tagId: {$in: authScheduleData.tagId},
                        memberId: authScheduleData.memberId
                    })
                    shareSchedule.map((shareScheduleData) => {
                        // flag변수를 통해 shareAllSchedule에 중복된 일정을 체크 후 중복되지 않으면 shareAllSchedule변수에 데이터 추가
                        let flag = shareAllSchedule.find(value => JSON.stringify(value.scheduleData) === JSON.stringify(shareScheduleData));
                        if (!flag) {
                            shareAllSchedule.push({
                                category: authScheduleData.color,
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
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저의 당일의 공유된 일정을 가져오는 함수
     * 주요 기능 :
     * - progress를 매게변수로 가져와 당일의 전체 일정, 완료된 일정, 진행중인 일정을 구분(대쉬보드 페이지의 공유된 일정 필터 기능)
     * - 유저의 _id 를 통해 공유된 일정을 반환하는 기능
     */
    todayShareSchedule : async(memberId, progress) => {
        try {
            // 나와 공유된 카테고리를 가져오는 기능
            let authSchedule = await category.find({shareMemberId: {$in: memberId}}).populate('memberId');
            // 카테고리와 공유된 일정을 가공하여 담을 객체 배열
            let todaySchedule = [];
            let today = new Date();
            let startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
            let endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            // 일정의 시작일은 당일날짜 + 하루 보다 작아야하고 종료일은 당일날짜 보다 큰경우 당일 일정
            // completion 조건으로 일정의 진행도 조건 추가
            await Promise.all(authSchedule.map(async (authScheduleData) => {
                    let shareSchedule = await schedule.find({
                        tagId: {$in: authScheduleData.tagId},
                        memberId: authScheduleData.memberId,
                        startDate: {$lte: startToday},
                        endDate: {$gte: endToday},
                        completion: progress != null ? progress : {$ne: null}
                    })
                    shareSchedule.map((shareScheduleData) => {
                        // flag변수를 통해 중복된 일정 데이터를 체크 후 todaySchedule변수에 데이터 추가
                        let flag = todaySchedule.find(value => JSON.stringify(value.scheduleData) === JSON.stringify(shareScheduleData));
                        if (!flag) {
                            todaySchedule.push({
                                scheduleData: shareScheduleData,
                                category: authScheduleData
                            })
                        }
                    })
                })
            )
            return todaySchedule;
        } catch (e) {
            throw new Error(e)
        }
    }
}