/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 영역의 탭기능으로 캘린더에 바인딩될 데이터 정의하고 바인딩하는 함수
 * 주요 기능 : address인자를 통해 나의 일정, 공유된 일정, 전체 일정을 가져 response받아 일정의 색상과 데이터를 바인딩하는 기능
 */
function scheduleListRequest(address) {
    // address에 따른 나의 일정, 공유된 일정, 전체일정 API호출
    const url = `/calendar/${address}`
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/json',
        success: function (res) {
            // 기존의 캘린더 이벤트를 지우고 받아온 데이터로 바인딩
            calendar.removeAllEvents();
            res.data.map((data) => {
                let schedule
                if(data.scheduleData){
                    schedule = {
                        start: data.scheduleData.startDate,
                        end: data.scheduleData.endDate,
                        title: data.scheduleData.title,
                        color: data.category ? data.category : "#f08080",
                        id: data.scheduleData._id
                    }
                }else{
                    schedule = {
                        start: data.startDate,
                        end: data.endDate,
                        title: data.title,
                        color: data.category ? data.category : "#f08080",
                        id: data._id
                    }
                }

                calendar.addEvent(schedule);
            })

        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 영역의 카테고리 클릭 기능으로 클릭한 카테고리에 관한 일정을 캘린더에 바인딩 하기위한 함수
 * 주요 기능 : 카테고리 _id 와 작성자 _id 를 넘겨 카테고리에 해당하는 일정을 가져와 캘린더에 바인딩하는 기능
 */
function shareCategorySearch(categoryId, authMemberId) {
    const url = '/calendar/shareSchedule'
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({categoryId: categoryId, authMemberId: authMemberId}),
        success: function (res) {
            calendar.removeAllEvents();
            res.data.map((data) => {
                let schedule = {
                    start: data.scheduleData.startDate,
                    end: data.scheduleData.endDate,
                    title: data.scheduleData.title,
                    color: data.category ? data.category : "#f08080",
                    id: data.scheduleData._id
                }
                calendar.addEvent(schedule);
            })

        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}