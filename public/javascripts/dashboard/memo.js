/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드가 랜더링 될시 메모리스트를 불러와 바인딩 하는 함수를 호출 하는 함수
 */
window.addEventListener('load', function () {
    memoList()
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모리스트를 정렬하는 팝업창이외의 다른 Element요소를 클릭시 팝업창 닫기 함수
 * 주요 기능 : 클릭한 this객체를 가져와 this객체의 className이 메모정렬 Element 자식 Element가 아닐경우 모달창 닫기
 */
window.addEventListener('click', function (e) {
    let memoSortModal = document.querySelector('.myMemoRight');
    let menu = document.querySelector('.sortMenu');
    if (!memoSortModal.getElementsByClassName(e.target.className).length) {
        menu.classList.remove('active');
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모리스트 일정들에 마우스 hover이벤트 함수
 * 주요 기능 : 메모리스트 일정들에 마우스 hover를 뒀을경우 메모 하위 일정들에 대해 hover클래스를 추가하여 css적용
 */
function memoScheduleHover(e) {
    let event = e.querySelectorAll('.memoSchedule');
    if (event) {
        for (let i = 0; i < event.length; i++) {
            event[i].classList.add('hover');
        }
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모리스트 일정들에 마우스 hover를 하지않을 때의 이벤트 함수
 * 주요 기능 : 메모리스트 일정들에 마우스 hover를 때었을경우 메모 하위 일정들에 대해 hover클래스를 삭제하여 css적용
 */
function memoScheduleNotHover(e) {
    let event = e.querySelectorAll('.memoSchedule');
    if (event) {
        for (let i = 0; i < event.length; i++) {
            event[i].classList.remove('hover');
        }
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 유저가 작성한 모든 메모리스트 데이터를 요청하고 response받은 데이터를 메모리스트에 바인딩 하는 함수
 * 주요 기능 : 메모리스트 들을 요청하고 메모리스트 Element에 데이터를 바인딩하는 기능
 */
function memoList() {
    $.ajax({
        type: 'get',
        url: '/memo',
        success: function (res) {
            let memoListData = []
            res.data.map((data) => {
                let memoScheduleData = [];
                // 작성된 메모에 하위 일정이 있을경우 하위 일정 데이터 가공
                data.schedule.map((schedule) => {
                    memoScheduleData.push(
                        `<div class="memoSchedule">
                        <i class="fa-solid fa-circle" style="color: #f08080"></i> <p>${schedule.title}</p>
                        </div>`
                    )
                })
                // 메모 리스트에 들어갈 각각의 메모 데이터와 하위 일정
                memoListData.push(`
                    <div id="${data._id}" class="memoDiv" onmouseover="memoScheduleHover(this)" onmouseout="memoScheduleNotHover(this)" onclick="memoModalOpen('${data._id}')">
                    <div class="memoContent">
                    <input class="hiddenDate" type="hidden" value="${data.date}">
                    <p class="memoText">${data.content}</p>
                    <div class="memoIcon">
                    <i onclick="deleteMemo('${data._id}')" class="fa-regular fa-trash-can"></i>
                    </div>
                    </div>
                    <div class="memoScheduleList">
                    ${memoScheduleData.join('')}
                    </div>
                    </div>
                `)
            })
            document.getElementById('memoList').innerHTML = memoListData.join('');
        },
        error: function (err) {
            console.log(err);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 유저가 메모를 작성할경우 메모를 생성하는 post요청을 보내고 메모 생성에 성공할 경우 메모를 바인딩하는 함수
 * 주요 기능 : 유저가 작성한 메모내용을 인자로 받아 메모를 생성하는 API를 호출
 * 호출된 response객체를 통해 생성될 메모의 Element객체를 생성하고 메모요소에 들어갈 이벤트들을 정의한뒤 메모 리스트하위에 작성된 메모 추가바인딩
 */
function addMemo(e) {
    // 엔터키 입력시 생성함수 호출 내용이없을경우 return
    if (window.event.keyCode == 13) {
        if (!e.value) {
            return
        }
        $.ajax({
            type: 'post',
            url: '/memo',
            contentType: 'application/json',
            data: JSON.stringify({content: e.value}),
            success: function (res) {
                let memoScheduleData = [];
                // 작성한 메모데이터를 요소화 시킬 변수
                let memoEl = document.createElement('div');
                memoEl.className = 'memoDiv';
                memoEl.id = `${res.data._id}`
                memoEl.onmouseover = () => {
                    memoScheduleHover(memoEl)
                };
                memoEl.onmouseout = () => {
                    memoScheduleNotHover(memoEl)
                };
                memoEl.onclick = () => {
                    memoModalOpen(`${res.data._id}`)
                };
                // 메모의 하위 일정
                res.data.schedule.map((schedule) => {
                    memoScheduleData.push(
                        `<div class="memoSchedule">
                        <i class="fa-solid fa-circle" style="color: #f08080"></i> <p>${schedule.title}</p>
                        </div>`
                    )
                })
                memoEl.innerHTML = `
                    <div class="memoContent">
                    <input class="hiddenDate" type="hidden" value="${res.data.date}">
                    <p class="memoText">${res.data.content}</p>
                    <div class="memoIcon">
                    <i onclick="deleteMemo('${res.data._id}')" class="fa-regular fa-trash-can"></i>
                    </div>
                    </div>
                    <div class="memoScheduleList">
                    ${memoScheduleData.join('')}
                    </div>
                `
                document.getElementById('memoList').appendChild(memoEl);
                e.value = null;
            },
            error: function (err) {
                console.log(err);
                return alert(err.responseJSON.message);
            }
        })
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모 리스트에서 유저가 메모삭제 버튼을눌러 메모를 삭제하기위한 함수
 * 주요 기능 : 선택된 메모의 _id값을 실어 메모 삭제 API를 호출한뒤 삭제 성공했을경우 메모리스트에서 삭제된 메모요소 삭제
 */
function deleteMemo(memoId) {
    event.stopPropagation();
    $.ajax({
        type: 'delete',
        url: '/memo',
        contentType: 'application/json',
        data: JSON.stringify({memoId: memoId}),
        success: function (res) {
            document.getElementById(`${memoId}`).remove();
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모리스트에서 메모를 정렬하기위한 메모팝업창 호출하는 함수
 * 주요 기능 : 토글을 이용해 메모팝업창 생성
 */
function sortMenu() {
    let menu = document.querySelector('.sortMenu');
    menu.classList.toggle('active')
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모정렬팝업창에서 선택된 정렬종류를 인자로 받아와 메모를 정렬시키는 함수를 호출하는 함수
 * 주요 기능 : 메모정렬팝업창에서 정렬기능을 눌렀을경우 메모팝업창을 닫는 기능
 * 메모리스트에 존재하는 모든 메모 Elements를 들고와 'asc' 'desc' 의 종류에따라 정렬함수 호출
 * 정렬함수호출로 반환된 데이터를 받아와 메모리스트 요소들을 초기화하고 정렬된데이터로 재바인딩
 */
function sort(type) {
    let menu = document.querySelector('.sortMenu');
    menu.classList.toggle('active')
    let memoData = document.querySelectorAll('.memoDiv');
    let memoSort = [];
    for (let i = 0; i < memoData.length; i++) {
        memoSort.push(memoData[i]);
    }
    let result;
    // 'asc', 'desc'에따라 각각 정렬 함수 호출 후 result변수에 반환되는 데이터 저장
    if (type == 'asc') {
        result = sortAsc(memoSort);
    } else {
        result = sortDesc(memoSort);
    }
    document.getElementById('memoList').innerHTML = null;
    result.map((data) => {
        document.getElementById('memoList').appendChild(data);
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모들을 생성 날짜 기준으로 오름차순으로 정렬하는 함수
 * 주요 기능 : input hidden 으로 준 생성일을 기준으로 오름차순으로 정렬후 정렬된 데이터를 리턴하는 기능
 */
function sortAsc(memoSort) {
    let result = memoSort.sort((a, b) => {
        let first = new Date(a.querySelector(".hiddenDate").value);
        let second = new Date(b.querySelector(".hiddenDate").value);
        if (first > second) {
            return 1;
        } else {
            return -1;
        }
        return 0;
    })
    return result;

}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 메모들을 생성 날짜 기준으로 내림차순으로 정렬하는 함수
 * 주요 기능 : input hidden 으로 준 생성일 기준으로 내림차순으로 정렬후 정렬된 데이터를 리턴하는 함수
 */
function sortDesc(memoSort) {
    let result = memoSort.sort((a, b) => {
        let first = new Date(a.querySelector(".hiddenDate").value);
        let second = new Date(b.querySelector(".hiddenDate").value);
        if (first < second) {
            return 1;
        } else {
            return -1;
        }
        return 0;
    })
    return result;
}