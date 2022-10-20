function allCategorySchedule() {
    const url = '/calendar/scheduleCalendar'
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/json',
        success: function (res) {
            calendar.removeAllEvents();
            res.scheduleCalendar.map((data) => {
                let schedule = {
                    start: data.scheduleData.startDate,
                    end: data.scheduleData.endDate,
                    title: data.scheduleData.title,
                    color: '#74c4bc',
                    id: data.scheduleData._id
                }
                calendar.addEvent(schedule);
            })

        },
        error: function (err) {
            alert(err);
        }
    })
}

function allShareSchedule() {
    const url = '/calendar/shareAllSchedule'
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/json',
        success: function (res) {
            calendar.removeAllEvents();
            res.data.map((data) => {
                let schedule = {
                    start: data.scheduleData.startDate,
                    end: data.scheduleData.endDate,
                    title: data.scheduleData.title,
                    color: '#74c4bc',
                    id: data.scheduleData._id
                }
                calendar.addEvent(schedule);
            })

        },
        error: function (err) {
            alert(err);
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
                    color: '#74c4bc',
                    id: data.scheduleData._id
                }
                calendar.addEvent(schedule);
            })

        },
        error: function (err) {
            alert(err);
        }
    })
}