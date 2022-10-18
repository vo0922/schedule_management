let scheduleData = [];
let calendarEl = document.getElementById('calendar');
let calendar;
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
            calendar = new FullCalendar.Calendar(calendarEl, {
                headerToolbar: {
                    left: 'title',
                    center: '',
                    right: 'prevYear,prev,next,nextYear today'
                },
                initialDate: new Date(),
                dayMaxEvents: true, // allow "more" link when too many events
                events: scheduleData,
                locale: "ko",
                dateClick: function (event) {
                    let clickDate = new Date(event.dateStr).getTime();
                    let scheduleList = [];
                    calendar.getEvents().map((data) => {
                        let startDate = new Date(data.start.toDateString());
                        let endDate = new Date(data.end).getTime();
                        if (clickDate >= startDate && clickDate < endDate) {
                            scheduleList.push(data);
                        }
                    })
                    if (scheduleList.length) {
                        scheduleListModalOpen(scheduleList);
                    } else {
                        scheduleModalOpen();
                    }
                },
                eventClick: function (event) {
                    scheduleViewModalOpen(event.event._def.publicId)
                }
            });
            calendar.render();
        },
        error: function (err) {
            console.log(err);
        }
    })
}
var scheduleListModal = document.getElementById('scheduleListModal');

function scheduleListModalDone() {
    scheduleListModal.style.display = 'none';
}

function scheduleListModalOpen(scheduleList) {
    scheduleListModal.style.display = 'block';
    let scheduleDivList = '';
    scheduleList.map((data) => {
        scheduleDivList += `<div class='scheduleDiv' onclick="scheduleViewModalOpen('${data._def.publicId}')"><div class="title">${data._def.title}</div></div>`
    })
    document.getElementById('scheduleDiv').innerHTML = scheduleDivList;
}
