const schedule = require('../models/schedule');
const category = require('../models/category');
const tagController = require('./tagController');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 모델을 컨트롤 하는 함수
 */
module.exports = {
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저의 일정 모두를 가져오는 함수
     * 주요 기능 : 유저 _id를 조건으로 일정과 매핑되어있는 태그를 함께 반환
     */
    mySchedule: async (memberId) => {
        try {
            return await schedule.find({memberId: memberId}).populate('tagId');
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저의 일정을 검색하는 함수
     * 주요 기능 : 검색어를 통해 유저의 일정을 태그와 함께 반환하는 기능
     */
    myScheduleSearch: async (memberId, text) => {
        try {
            return await schedule.find({
                memberId: memberId,
                title: {$regex: text}
            }).populate('tagId');
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 새로운 일정을 생성하는 함수
     * 주요 기능 : request로 받아온 일정 데이터를 통해 새로운 일정 객체를 생성
     * 일정 생성시 작성한 태그들을 태그 컨트롤러를 통해 태그를 생성하고 새로운 일정 객체에 태그 데이터를 매핑후 데이터 저장
     */
    created: async (schedules, memberId) => {
        // 태그는 생성되지 않았기에 태그 데이터는 비우고 일정 객체 생성
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
            // 생성된 태그를 담을 변수
            let newTag = []
            await Promise.all(schedules.tags.map(async (data) => {
                // 생성된 일정 객체를통해 생성된 일정 _id를 태그생성 컨트롤러 함수인자로 넘김
                const tagData = await tagController.created(data, memberId, newSchedule._id);
                // 생성된 태그를 newTag 배열에 추가
                newTag.push(tagData._id);
            }))
            return await schedule.findOneAndUpdate({_id: newSchedule._id}, {$set: {tagId: newTag}});
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저 일정을 수정하는 함수
     * 주요 기능 : 일정 _id을 조건으로 일정을 수정하는 기능
     */
    updated: async (schedules, memberId) => {
        try {
            let leftScheduleData = await schedule.findOne({_id: schedules._id});
            // 태그 컨트롤러에서 연결된 일정 매핑관계를 끊어 주는 함수
            await tagController.editCreated(leftScheduleData._id);
            // 일정에 매핑될 태그데이터를 담을 변수
            let newTags = [];
            await Promise.all(schedules.tags.map(async (data) => {
                // 태그 컨트롤러에서 일정에 추가된 태그를 생성 및 가져오는 함수
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
                    tagId: newTags,
                    completion: schedules.completion
                }
            });
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 일정을 삭제하는 함수
     * 주요 기능 : 일정 _id를 통해 일정 삭제
     */
    deleted: async (schedules) => {
        try {
            return await schedule.deleteOne({_id: schedules});
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 캘린더에 바인딩될 유저 전체 일정을 반환하는 함수
     * 주요 기능 : 카테고리색과 일정의 묶음으로 유저 전체 일정을 반환하는 기능
     */
    scheduleCalendar: async (memberId) => {
        try {
            const scheduleData = await schedule.find({memberId: memberId});

            let authSchedule = await category.find({shareMemberId: {$in: memberId}});
            // 일정, 일정과 관련된 카테고리를 담을 객체 배열 변수
            let allSchedule = [];
            // 유저의 일정은 기본 색상으로 지정해주기위한 데이터 추가
            scheduleData.map((data) => {
                allSchedule.push({
                    category: '',
                    scheduleData: data,
                })
            })

            await Promise.all(authSchedule.map(async (authScheduleData) => {
                // 카테고리 작성자와 일정 작성자가 일치하는 데이터를 가져오기 위한 함수
                    let shareSchedule = await schedule.find({
                        tagId: {$in: authScheduleData.tagId},
                        memberId: authScheduleData.memberId
                    })
                    shareSchedule.map((shareScheduleData) => {
                        // flag변수를 통해 죽복된 일정을 체크 후 카테고리 색상과 일정 데이터를 allSchedule배열 변수에 추가
                        let flag = allSchedule.find(value => JSON.stringify(value.scheduleData._id) === JSON.stringify(shareScheduleData._id));
                        if (!flag) {
                            allSchedule.push({
                                category: authScheduleData.color,
                                scheduleData: shareScheduleData,
                            })
                        }
                    })
                })
            )

            return allSchedule
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 일정 상세 페이지에 필요한 데이터를 반환하는 함수
     * 주요 기능 : 일정 _id를 조건으로 매핑된 작성자와 태그데이터들을 함께 반환하는 기능
     */
    readed: async (scheduleId) => {
        try {
            const scheduleData = await schedule.findOne({_id: scheduleId}).populate('memberId').populate('tagId');
            return scheduleData;
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱
     * 함수 설명 : 유저의 일정을통해 각태그마다 사용횟수를 반환 하기위한 함수
     * 주요 기능 : 유저가 사용한 각태그들의 사용횟수와 태그데이터들을 가공하여 반환하는 기능
     */
    totalTag: async (memberId) => {
        try {
            // member가 작성한 일정에 포함된 태그 정보들을 불러와라.
            const tagName = await schedule.find({memberId: memberId}).populate('tagId')
            let totalTag = []
            tagName.map((schedule) => {
                schedule.tagId.map((tagData) => {
                    // flag변수를 통해 중복된 태그일경우 사용횟수 +1 중복되지 않은 태그일경우 태그데이터 추가
                    let flag = totalTag.findIndex(value => value.tag._id === tagData._id);
                    if (flag == -1) {
                        totalTag.push({
                            tag: tagData,
                            count: 1,
                        })
                    } else {
                        totalTag[flag].count += 1
                    }
                })
            })
            return totalTag;
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 박신욱, 이승현
     * 함수 설명 : 유저가 작성한 당일 일정들을 가져오는 함수
     * 주요 기능 : 대쉬보드에 사용될 유저의 오늘 일정데이터를 반환 하는 기능
     */
    todaySchedule: async (memberId) => {
        try {
            let today = new Date();
            let startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
            let endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

            // 일정의 시작일은 당일날짜 + 하루 보다 작아야하고 종료일은 당일날짜 보다 큰경우 당일 일정
            const todaySchedule = await schedule.find({
                memberId: memberId,
                startDate: {$lte: startToday},
                endDate: {$gte: endToday}
            });

            return todaySchedule;
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 담당자 : 이승현
     * 함수 설명 : 유저 _id를 인자로 받아와 유저의 일정과 매핑되어있는 태그 데이터들을 같이 반환하는 함수
     * 주요 기능 : 유저의 일정 데이터와 태그 데이터들을 반환하는 기능
     */
    tagAboutSchedule: async (memberId) => {
        try {
            const tagAboutScheduleData = await schedule.find({memberId: memberId}).populate('tagId')
            return tagAboutScheduleData
        } catch (e) {
            throw new Error(e)
        }
    },
    /**
     * 담당자 : 이승현
     * 함수 설명 : 일정 데이터를 일정 진행도(완료/진행중)를 수정하는 함수
     * 주요 기능 : 대시보드에서 일정 진행도 상태를 동적으로 변경하고.
     *            그에 따른 오늘 일정 완료율 또한 변동됩니다.
     */
    scheduleProgress: async (scheduleId, progress) => {
        try {
            const scheduleData = await schedule.findOneAndUpdate({_id: scheduleId}, {
                $set :{
                    completion: progress
            }
        // update된 이후의 데이터를 받아오기 위해서 {new: true}를 적어준다.
        },{new: true})
        return scheduleData

        } catch (e) {
            throw new Error(e)
        }
    }
}