let calendarEl = document.getElementById('calendar');
let calendar;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 캘린더 페이지가 랜더링 되었을 때 캘린더에 초기 데이터를 바인딩 하고 캘린더의 이벤트들을 설정하는 함수
 * 주요 기능 : 유저의 전체 일정 데이터를 가져와 데이터를 바인딩하고 캘린더의 기본값과 이벤트들을 설정하는 기능
 */
window.onload = function () {
    let scheduleData = [];
    $.ajax({
        type: 'get',
        url: '/calendar/scheduleCalendar',
        async: false,
        success: function (res) {
            // 캘린더에 바인딩 될 데이터들을 가공 하여 scheduleData변수에 추가
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
                // 캘린더의 헤더부분의 설정
                headerToolbar: {
                    left: 'title',
                    center: '',
                    right: 'prevYear,prev,next,nextYear today'
                },
                initialDate: new Date(),
                dayMaxEvents: true,
                events: scheduleData,
                // 캘린더의 more을 클릭 했을경우 커스텀한 오늘 일정 리스트 모달창을 띄워주고 return을 none으로 주어 기존 캘린더의 more클릭 기능을 없애줌
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
                // 날짜를 클릭 했을 경우
                dateClick: function (event) {
                    let clickDate = new Date(event.date.toDateString()).getTime();
                    // 일정 리스트에 들어갈 객체 배열 변수
                    let scheduleList = [];
                    calendar.getEvents().map((data) => {
                        let startDate = new Date(data.start.toDateString()).getTime();
                        let endDate = data.end ? new Date(data.end.toDateString()).getTime() : new Date(data.start.toDateString()).getTime()
                        // 바인딩 되어있는 일정이 클릭한 일정 사이에있을경우 일정리스트에 들어갈 데이터 추가
                        if (clickDate >= startDate && clickDate <= endDate) {
                            scheduleList.push(data);
                        }
                    })
                    // 일정이 있을경우 일정리스트 데이터를 인자로 넘겨 일정리스트 모달창 오픈
                    // 일정이 존재하지 않을경우 클릭한 날짜를 시작일로 하는 일정 생성 모달창 오픈
                    if (scheduleList.length) {
                        scheduleListModalOpen(scheduleList);
                        clickDateRequest(event)
                    } else {
                        scheduleModalOpen(event.date);
                    }
                },
                // 일정하나를 클릭 하였을 경우 클릭한 일정의 상세페이지를 보여주는 모달창 오픈
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 리스트의 정렬 Element를 제외한 다른 요소를 클릭했을시 정렬 모달창 끄기
 * 주요 기능 : 정렬 Element가 this된 객체와 다를경우 정렬 모달창 닫기
 */
window.addEventListener('click', function (e) {
    let scheduleListSort = document.getElementById('scheduleListSortDiv_icon');
    let sortModal = document.getElementById('scheduleListSortDiv_select');
    if (sortModal && scheduleListSort != e.target) {
        sortModal.style.display = 'none'
    }
})

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
    <div class="scheduleListSortDiv" id="scheduleListSortDiv_select" style="display: none;">
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
    document.getElementById('sortModal').innerHTML = scheduleListSortDiv

}

function sortModalOpen() {
    if(document.getElementById('scheduleListSortDiv_select').style.display == 'none'){
        document.getElementById('scheduleListSortDiv_select').style.display = 'block'
    }else {
        document.getElementById('scheduleListSortDiv_select').style.display = 'none'
    }
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
