let scheduleData = [];
mobiscroll.momentTimezone.moment = moment;
window.onload = function () {
    $.ajax({
        type: 'get',
        url: '/calendar/scheduleCalendar',
        async: false,
        success: function (res) {
            res.scheduleCalendar.map((data) => {
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
                    scheduleViewModalOpen(event.event.id);
                }
            }
        });
}




