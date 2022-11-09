let memoModal = document.getElementById('memoModal');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모리스트에서 메모를 눌렀을경우 보여질 메모상세모달창을 보여주고 데이터를 바인딩 하는 함수
 * 주요 기능 : 선택된 메모 _id로 메모상세페이지에 사용될 데이터를 요청하고 response받은 데이터를 통해 각요소들의 이벤트를 정의하고 바인딩하는 기능
 */
function memoModalOpen(memoId) {
    $.ajax({
        type: 'post',
        url: '/memo/view',
        contentType: 'application/json',
        data: JSON.stringify({memoId: memoId}),
        success: function (res) {
            document.getElementById('myScheduleSearch').value = null
            // response 객체를 인자로넘겨 메모상세페이지 모달창에 데이터를 바인딩 시키는 함수
            memoModalBind(res)
            document.getElementById('memoContent').value = res.memoData.content
            // 메모를 삭제하는 버튼에 이벤트를 정의
            document.getElementById('memoDeleteButton').onclick = () => {
                deleteMemo(`${res.memoData._id}`);
                memoModalDone();
            }
            // 메모를 편집하는 버튼에 이벤트를 정의
            document.getElementById('memoSaveButton').onclick = () => {
                submitMemo(`${res.memoData._id}`);
            }
            // 일정을 찾는 요소에 유저의 일정을 찾을수있는 함수를 정의
            document.getElementById('myScheduleSearch').onkeyup = () => {
                scheduleSearch(`${res.memoData._id}`)
            }
            let checkScheduleData = [];
            // 선택된 메모에 하위 일정이 있을경우 하위 일정을 바인딩하는 함수
            res.memoData.schedule.map((data) => {
                checkScheduleData.push(
                    `
                    <div id="${data._id}" onclick="scheduleViewModalOpen('${data._id}', true)" class="checkMySchedule">
                        <p class="scheduleTitle">${data.title}</p>
                    </div>
                    `
                )
            })
            document.getElementById('myScheduleCheckList').innerHTML = checkScheduleData.join('');
            memoModal.style.display = 'block';
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모 상세페이지이외의 다른 요소클릭시 메모상세모달창 닫기 함수
 */
window.addEventListener('click', function (event) {
    if (event.target == memoModal) {
        memoModalDone();
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모하위에 추가될 일정을 검색하고 검색된 데잍터를 바인딩 하는 함수
 * 주요 기능 : 메모 _id 와 검색 내용을 body로 일정 검색 API를 요청하고 response된 객체를 통해 일정리스트 바인딩
 */
function scheduleSearch(memoId) {
    $.ajax({
        type: 'post',
        url: '/memo/view/search',
        contentType: 'application/json',
        data: JSON.stringify({memoId: memoId, text: document.getElementById('myScheduleSearch').value}),
        success: function (res) {
            memoModalBind(res)
        },
        error: function (err) {
            console.log(err);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모상세 모달창에서 사용될 데이터들을 바인딩하는 함수
 * 주요 기능 : 인자로 받은 데이터를 통해 메모모달창에 데이터 바인딩
 * 일정리스트에서 각일정들마다 태그 갯수가 3개이상일경우 ...으로 표시
 */
function memoModalBind(res) {
    let myScheduleData = [];

    res.myScheduleData.map((data) => {
        let myScheduleTagData = [];
        // 각일정들의 태그종류가 3개이상일경우 ...으로 표시하고 리턴하고 태그들의 이름을 태그변수에 추가
        data.tagId.map((data, idx) => {
            if (idx > 3) {
                myScheduleTagData.push('...');
                return
            }
            myScheduleTagData.push(
                        `
                        #${data.name}
                        `
            )
        })
        // 메모 하위일정에 이미 데이터가 존재할경우 삼항연산자로 일정 check여부 판단 하고 데이터 바인딩
        let flag = res.memoData.schedule.find(value => value._id == data._id);
        myScheduleData.push(
            `
                    <div class="mySchedule">
                        <input onchange='scheduleCheck(${JSON.stringify(data)}, this)' type="checkbox" style="margin-right: 10px;" ${flag ? 'checked' : null}> 
                        <p class="scheduleTitle">${data.title}</p>
                        <p class="scheduleTag">${myScheduleTagData.join('')}</p>
                    </div>
                    `
        )
    })
    document.getElementById('myScheduleList').innerHTML = myScheduleData.join('')
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모에 하위 일정을 추가하거나 제거할경우 처리될 함수
 * 주요 기능 : 메모에 하위일정을 추가할 경우 추가한 일정요소를 생성하는 함수를 호출한뒤 일정 리스트 Elements에 요소 추가
 * 메모하위 일정을 제거할경우 일정리스트에서 제거한 요소 삭제
 */
function scheduleCheck(schedule, e) {
    let myScheduleList = document.getElementById('myScheduleCheckList');
    if (e.checked) {
        let checkSchedule = checkScheduleCreate(schedule);
        myScheduleList.appendChild(checkSchedule);
    } else {
        document.getElementById(`${schedule._id}`).remove();
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 추가된 일정데이터를 가져와 일정리스트에 추가될 Element를 생성하는 함수
 * 주요 기능 : 일정리스트에 추가될 Element를 생성하고 일정 상세페이지를 볼수있는 클릭 이벤트 정의한 후 추가된 일정요소 반환
 */
function checkScheduleCreate(schedule) {
    let newSchedule = document.createElement('div');
    newSchedule.id = schedule._id;
    newSchedule.className = 'checkMySchedule';
    newSchedule.onclick = () => scheduleViewModalOpen(`${schedule._id}`, true);
    newSchedule.innerHTML = `<p className="scheduleTitle">${schedule.title}</p>`
    return newSchedule
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모를 편집버튼을 눌렀을때 메모 편집API를 호출하는 함수
 * 주요 기능 : 수정된 메모데이터와 하위일정들을 가공하여 메모편집 API를호출하는 기능
 */
function submitMemo(memoId) {
    let content = document.getElementById('memoContent').value;
    let checkSchedule = document.getElementsByClassName('checkMySchedule');
    let data = {
        _id: memoId,
        content: content,
        schedules: [],
    }
    for (let i = 0; i < checkSchedule.length; i++) {
        data.schedules.push(checkSchedule[i].id);
    }
    if (content == '') {
        return alert("메모 내용이 비어있습니다.");
    }
    $.ajax({
        type: 'patch',
        url: '/memo',
        contentType: 'application/json',
        data: JSON.stringify({data: data}),
        success: function (res) {
            location.reload();
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모 상세페이지 모달창을 닫는 함수
 */
function memoModalDone() {
    memoModal.style.display = 'none';
}




