let scheduleData = [];
let calendarEl = document.getElementById('calendar');
let calendar;
window.onload = function () {
    $.ajax({
        type: 'get',
        url: '/calendar/scheduleCalendar',
        async: false,
        success: function (res) {
            res.data.map((data) => {
                let schedule = {
                    start: data.scheduleData.startDate,
                    end: data.scheduleData.endDate,
                    title: data.scheduleData.title,
                    color: data.category ? data.category : "#f08080",
                    id: data.scheduleData._id
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
                moreLinkClick: function (event) {
                    let scheduleList = [];
                    event.allSegs.map((data) => {
                        scheduleList.push(data.event);
                    })
                    scheduleListModalOpen(scheduleList);
                    clickDateRequest(event)
                    return "none"
                },
                locale: "ko",
                // 달력의 날짜 클릭했을 때
                dateClick: function (event) {
                    let clickDate = new Date(event.date.toDateString()).getTime();
                    let scheduleList = [];
                    calendar.getEvents().map((data) => {
                        let startDate = new Date(data.start.toDateString()).getTime();
                        let endDate = data.end ? new Date(data.end.toDateString()).getTime() : new Date(data.start.toDateString()).getTime()
                        if (clickDate >= startDate && clickDate <= endDate) {
                            scheduleList.push(data);
                        }
                    })
                    if (scheduleList.length) {
                        scheduleListModalOpen(scheduleList);
                        clickDateRequest(event)
                    } else {
                        scheduleModalOpen(event.date);
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

function clickDateRequest(event) {
    // 클릭한 날짜 정보 받아오기
    let needDay = new Date(event.date).getDate();
    var needWeekend = new Array('일', '월', '화', '수', '목', '금', '토')
    var needDayStr = new Date(event.date).getDay();

    let today = `<p class="scheduleToday">${needDay}. ${needWeekend[needDayStr]}</p>`

    document.getElementById('nows').innerHTML = today
}

function scheduleListModalOpen(scheduleList) {
    scheduleListModal.style.display = 'block';

    let scheduleDivList = '';
    // 일정 목록 정렬 filter
    let scheduleListSortDiv = `
    <div name="scheduleListSortDiv" id="scheduleListSortDiv_select" style="display: none;">
        <option class="option" value="title" onclick='scheduleListSort(${JSON.stringify(scheduleList)}, this)'>이름순</option>
        <option class="option" value="start" onclick='scheduleListSort(${JSON.stringify(scheduleList)}, this)'>시작일순</option>
        <option class="option" value="end" onclick='scheduleListSort(${JSON.stringify(scheduleList)}, this)'>종료일순</option>
    </div>`

    scheduleList.map((data) => {
        let startDate = new Date(data.start)
        var weekend = new Array('일', '월', '화', '수', '목', '금', '토')
        // 일정 목록 endDay 받아오기
        let startYear = startDate.getFullYear()
        let startMonth = startDate.getMonth() + 1
        let startDay = startDate.getDate()
        let startDayStr = startDate.getDay()
        let startHours = startDate.getHours() < 12 ? "AM " + startDate.getHours() : "PM " + (startDate.getHours() - 12)
        let startMinutes = startDate.getMinutes()

        // endDay
        let endDate = new Date(data.end ? data.end : data.start)
        // 일정 목록 endDay 받아오기
        let endYear = endDate.getFullYear()
        let endMonth = endDate.getMonth() + 1
        let endDay = endDate.getDate()
        let endDayStr = endDate.getDay()
        let endHours = endDate.getHours() < 12 ? "AM " + endDate.getHours() : "PM " + (endDate.getHours() - 12)
        let endMinutes = endDate.getMinutes()
        scheduleDivList += 
        `<div class="scheduleDiv_li">
            <div class="list_style" style="background-color: ${data.borderColor}"></div>
            <li class='scheduleDiv' onclick="scheduleViewModalOpen('${data._def.publicId}')">
                <div class="title_group">
                    <div class="title sortDivList">${data._def.title}</div>
                </div>
                <div class="time_flex">
                    <div class="start sortDivList">
                    ${startYear}.${startMonth}.${startDay}.${weekend[startDayStr]}, ${startHours}:${startMinutes}
                    </div>
                    <div class="sortDivList"> - </div>
                    <div class="end sortDivList">
                    ${endYear}.${endMonth}.${endDay}.${weekend[endDayStr]}, ${endHours}:${endMinutes}
                    </div>
                </div>
            </li>
        </div>`
    })
    document.getElementById('scheduleDiv').innerHTML = scheduleDivList;
    document.getElementById('scheduleListSortDiv_icon').innerHTML = scheduleListSortDiv
    // filter 클릭 시 option toggle
    var count = 0;

    document.getElementById('scheduleListSortDiv_icon').addEventListener('click', function () {
        count++;
        if (count % 2 == 0) {
            document.getElementById('scheduleListSortDiv_select').style.display = 'none'
        } else {
            document.getElementById('scheduleListSortDiv_select').style.display = 'block'
        }
    })
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
    let scheduleListBinding = document.getElementById('scheduleDiv')
    // 1. 버튼 누르면
    // 2. scheduleList 안에 있는 자료들을 가나다순으로 정렬하고
    // 3. 안에 내용물을 싹 지웠다가 가나다순으로 다시 만들어라

    function titleSort() {  // 이름순
        scheduleListSortObject.sort(function (a, b) {
            if (a.title > b.title) {
                return 1
            } else {
                return -1
            }
        })
    }

    function startSort() {  // startDay순
        scheduleListSortObject.sort(function (a, b) {
            if (a.start > b.start) {
                return 1
            } else {
                return -1
            }
        })
    }

    function endSort() {    // endDay순
        scheduleListSortObject.sort(function (a, b) {
            let a_end = a.end ? a.end : a.start
            let b_end = b.end ? b.end : b.start
            if (a_end > b_end) {
                return 1
            } else {
                return -1
            }
        })
    }

    // 종류별로 변경된 데이터 뿌려주기
    let scheduleListWantSort = []
    scheduleListSortObject.forEach((a, i) => {
        // startDay
        let startDate = new Date(scheduleListSortObject[i].start)

        var weekend = new Array('일', '월', '화', '수', '목', '금', '토')

        // 일정 목록 startDay 받아오기
        let startYear = startDate.getFullYear()
        let startMonth = startDate.getMonth() + 1
        let startDay = startDate.getDate()
        let startDayStr = startDate.getDay()
        let startHours = startDate.getHours() < 12 ? "AM " + startDate.getHours() : "PM " + (startDate.getHours() - 12)
        let startMinutes = startDate.getMinutes()

        // endDay
        let endDate = new Date(scheduleListSortObject[i].end ? scheduleListSortObject[i].end : scheduleListSortObject[i].start)

        // 일정 목록 endDay 받아오기
        let endYear = endDate.getFullYear()
        let endMonth = endDate.getMonth() + 1
        let endDay = endDate.getDate()
        let endDayStr = endDate.getDay()
        let endHours = endDate.getHours() < 12 ? "AM " + endDate.getHours() : "PM " + (endDate.getHours() - 12)
        let endMinutes = endDate.getMinutes()

        scheduleListWantSort.push(`
        <div class="scheduleDiv_li">
            <div class="list_style" style="background-color: ${scheduleListSortObject[i].borderColor}"></div>
            <li class="scheduleDiv sortDiv">
                <div class="title sortDivList">${scheduleListSortObject[i].title}</div>
                <div class="time_flex">
                    <div class="start sortDivList">${startYear}.${startMonth}.${startDay}.${weekend[startDayStr]}, ${startHours}:${startMinutes}</div>
                    <div class="sortDivList"> - </div>
                    <div class="end sortDivList">${endYear}.${endMonth}.${endDay}.${weekend[endDayStr]}, ${endHours}:${endMinutes}</div>
                </div>
            </li>
        </div>
        `)
    });
    scheduleListBinding.innerHTML = scheduleListWantSort.join('')
}
