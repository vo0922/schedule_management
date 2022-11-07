function scheduleListRequest(address) {
    const url = `/calendar/${address}`
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/json',
        success: function (res) {
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
            return alert(err.responseJSON.message);
        }
    })
}

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
            return alert(err.responseJSON.message);
        }
    })
}