let scheduleData = [];
$.ajax({
    type: 'get',
    url : '/calendar/scheduleCalendar',
    success: function (res){
        res.scheduleCalendar.map((data)=>{
            let schedule = {
                start: data.startDate,
                end: data.endDate,
                title: data.title,
                color: '#d64646',
                id: data._id
            }
            scheduleData.push(schedule);
        })
    },
    error: function (err) {
        console.log(err);
    }
})
window.setTimeout(() =>{
    mobiscroll.momentTimezone.moment = moment;

    mobiscroll.eventcalendar('#calendar', {
        dataTimezone: 'utc',
        displayTimezone: 'Asia/Shanghai',
        timezonePlugin: mobiscroll.momentTimezone,

        view: {
            calendar: {
                type: 'month',
                popover: true,
            }
        },
        data: scheduleData,
        onEventClick: function (event, inst) {
            if (event.source == 'popover') {
                console.log(event);
            }
        }
    });
}, 500)


