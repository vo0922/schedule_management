let scheduleData = [];
let calendarEl = document.getElementById('calendar');
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
            var calendar = new FullCalendar.Calendar(calendarEl, {
                headerToolbar: {
                    left: 'title',
                    center: '',
                    right: 'prevYear,prev,next,nextYear today'
                },
                initialDate: new Date(),
                dayMaxEvents: true, // allow "more" link when too many events
                events: scheduleData,
                locale: "ko",
/*                customButtons: {
                    addEventButton: {
                        text: "일정 추가",
                        click: function () {
                            scheduleModalOpen()
                        },
                    },
                },*/
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
    let scheduleListSortDiv = `<select name="scheduleListSortDiv" id="scheduleListSortDiv" onchange='scheduleListSort(${JSON.stringify(scheduleList)}, this)'>
    <option value="title">이름순</option>
    <option value="start">시작일순</option>
    <option value="end">종료일순</option>
    </select>`
    scheduleList.map((data) => {
        scheduleDivList += `<div class='scheduleDiv' onclick="scheduleViewModalOpen('${data._def.publicId}')">
        <div class="title">${data._def.title}</div>
        <div class="start">${data.start.toLocaleString()}</div>
        <div class="end">${data.end.toLocaleString()}</div>
        </div>`
    })
    document.getElementById('scheduleDiv').innerHTML = scheduleDivList;
    document.getElementById('scheduleListSortDiv').innerHTML = scheduleListSortDiv
    console.log(scheduleList)
}

// 일정 목록 정렬 기능
function scheduleListSort(scheduleList, e) {
    let scheduleListSortObject = scheduleList
    switch (e.value) {
        case "title":
            titleSort()
            break
        case "start":
            startSort()
            break
        default :
            endSort()
            break
    }
    let 일정목록바인딩 = document.getElementById('scheduleDiv')
    // 1. 버튼 누르면
    // 2. scheduleList 안에 있는 자료들을 가나다순으로 정렬하고
    // 3. 안에 내용물을 싹 지웠다가 가나다순으로 다시 만들어라
    // 이름순
    function titleSort() {
        scheduleListSortObject.sort(function(a, b) {
            if(a.title > b.title){
                return 1
            } else {
                return -1
            }
        })
    }
    function startSort() {
        scheduleListSortObject.sort(function(a,b) {
        if(a.start > b.start){
            return 1
        } else {
            return -1
        }
    })
    }
    function endSort() {
        scheduleListSortObject.sort(function(a, b) {
            if(a.end > b.end) {
                return 1
            } else {
                return -1
            }
        })
    }
    let 일정목록 = []
    scheduleListSortObject.forEach((a, i) => {
            일정목록.push(`<div class="sortDiv">
            <div class="title">${scheduleListSortObject[i].title}</div>
            <div class="start">${scheduleListSortObject[i].start.toLocaleString()}</div>
            <div class="end">${scheduleListSortObject[i].end.toLocaleString()}</div>
            </div>`) 
            console.log(일정목록)
        });
    일정목록바인딩.innerHTML = 일정목록.join('')
 
}