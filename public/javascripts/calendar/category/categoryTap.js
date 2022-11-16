/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 영역에서 전체, 나의일정, 공유일정을 담은 탭 메뉴의 각기능
 * 주요 기능 : 탭을 클릭 하였을 경우 클릭한 this객체를 가져와 클릭한 탭의 클래스를 수정하여 현재 클릭한 탭 표시
 * this의 객체에있는 text를 통해 나의 일정 기능, 공유 일정 기능, 전체 일정 기능 함수 호출
 */
function tabClick(e) {
    let tab_link = document.getElementsByClassName('tab-link')
    for (let i = 0; i < tab_link.length; i++) {
        tab_link[i].classList.remove('current');
    }
    e.classList.add('current');
    let tab_id = e.getAttribute('data-tab');
    let tab_content = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tab_content.length; i++) {
        tab_content[i].classList.remove('current');
    }
    document.getElementById(tab_id).classList.add('current');
    switch (e.innerText) {
        case "나의 일정":
            scheduleListRequest('mySchedule');
            break
        case "공유 일정":
            scheduleListRequest('shareAllSchedule');
            break
        case "전체":
            scheduleListRequest('scheduleCalendar');
            break
        default:
            return
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 삭제 버튼을 클릭했을경우 카테고리를 삭제하는 함수
 * 주요 기능 : 카테고리 _id와 카테고리 이름을 인자로 받아 이름을 재확인하여 confirm을 받고 카테고리 _id 로 삭제하는 요청을 보냄
 */
function categoryDelete(categoryId, name) {
    event.stopPropagation();
    if (!confirm(`${name} 카테고리를 삭제 하시겠습니까?`)) {
        return
    }
    const url = '/category'
    $.ajax({
        type: 'delete',
        contentType: 'application/json',
        url: url,
        data: JSON.stringify({categoryId: categoryId}),
        success: function (res) {
            alert(res.message);
            location.reload()
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 나의 일정 탭에서 일정 검색 할때 검색데이터를 가져오는 함수
 * 주요 기능 : 검색데이터를 통해 일정목록에 데이터 바인딩
 */
function scheduleSearch(e) {
    $.ajax({
        type: 'post',
        url: '/calendar/scheduleSearch',
        contentType: 'application/json',
        data: JSON.stringify({text: e.value}),
        success: function (res) {
            let myScheduleData = [];
            res.data.map((data) => {
                myScheduleData.push(
                    `
                    <div class="myScheduleList" onclick="scheduleViewModalOpen('${data._id}')">
                        <p>${data.title.length > 15 ? data.title.substr(0, 15) + '...' : data.title}</p>
                    </div>
                    `
                )
            })
            document.getElementById('myScheduleList').innerHTML = myScheduleData.join('');
        },
        error: function (err) {
            console.log(err);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정검색영역의 새로고침을 클릭했을경우 실행되는 함수
 * 주요 기능 : 검색란을 초기화시키고 유저의 일정을 불러오는 기능
 */
function searchReload() {
    let scheduleSearchText = document.getElementById('myScheduleSearch');
    scheduleSearchText.value = null;
    scheduleSearch(scheduleSearchText);
}