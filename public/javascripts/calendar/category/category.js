function shareCategorySearch(categoryId, authMemberId) {
    const url = '/calendar/shareSchedule'
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({categoryId: categoryId, authMemberId: authMemberId}),
        success: function (res) {
            console.log(res.data);
            calendar.removeAllEvents();
            res.data.map((data)=>{
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