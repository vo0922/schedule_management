var modal = document.getElementById('scheduleModal');
var scheduleSubmitModal = document.getElementById('scheduleSubmitModal');
var c_modal = document.getElementById('categoryModal');
var scheduleListModal = document.getElementById('scheduleListModal');

var startDate = document.getElementById('schedule_start_day');
var endDate = document.getElementById('schedule_end_day');
var date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);

// 일정모달창의 알림기능 중복 처리를 하기위한 변수
let aleartFlag = 0;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 모달창에서 글자수 제한 알림이 발생할 경우 알림이 들어갈 내용을 정의하고 표출하는 함수
 * 주요 기능 : this객체와 글자 수 제한을 인자로 받아 각 알림에 맞는 내용을 표출하고 투명도를 이용해 알림창 커스텀
 */
function handleLine(e, line) {
    // this객체의 글자수가 설정한 글자 수보다 높을 경우 알림창 표출
    if (e.value.length > line) {
        // 글자 수 제한에 맞게 this객체의 글자 수 반환
        e.value = e.value.substr(0, line);
        // aleartFlag가 1일경우 중복실행을 못하도록 return
        if (aleartFlag == 1) {
            return
        }
        aleartFlag = 1;
        let lineAlertDiv = document.getElementById('lineAlert');
        lineAlertDiv.innerHTML = `글자 수 ${line}자를 넘을 수 없습니다.`
        lineAlertDiv.style.display = 'block'
        lineAlertDiv.style.opacity = 0.6;
        let alertTimer = setInterval(() => {
            lineAlertDiv.style.opacity -= 0.02
        }, 50)
        setTimeout(() => {
            clearInterval(alertTimer);
            lineAlertDiv.style.display = 'none'
            aleartFlag = 0;
        }, 1500)
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 모달창에서 각내용에 맞는 알림창을 정의하고 표출하는 함수
 * 주요 기능 : 알림의 내용을 인자로받아 알림창 표출
 */
function handleAlert(text) {
    if (aleartFlag == 1) {
        return
    }
    aleartFlag = 1;
    let lineAlertDiv = document.getElementById('lineAlert');
    lineAlertDiv.innerHTML = text;
    lineAlertDiv.style.display = 'block'
    lineAlertDiv.style.opacity = 0.6;
    let alertTimer = setInterval(() => {
        lineAlertDiv.style.opacity -= 0.02
    }, 50)
    setTimeout(() => {
        clearInterval(alertTimer);
        lineAlertDiv.style.display = 'none'
        aleartFlag = 0;
    }, 1500)
}

const label = document.querySelectorAll('.progress_label');

label[0].addEventListener('click', labelHandle)

function labelHandle() {
    const lb = document.querySelectorAll('.progress_label')[0];
    let progress_optionList = lb.nextElementSibling;
    let progress_optionItems = progress_optionList.querySelectorAll('.progress_optionItem');
    clickLabel(lb, progress_optionItems);
}

function handleSelect(label, item) {
    document.getElementById('completeLabel').innerHTML = item.innerHTML;
    label.parentNode.classList.remove('active');
}

function clickLabel(lb, progress_optionItems) {
    if (lb.parentNode.classList.contains('active')) {
        lb.parentNode.classList.remove('active');
        // 옵션 클릭 시 클릭한 옵션을 넘김
        progress_optionItems.forEach((opt) => {
            opt.removeEventListener('click', () => {
                handleSelect(lb, opt)
            })
        })
    } else {
        lb.parentNode.classList.add('active');
        progress_optionItems.forEach((opt) => {
            opt.addEventListener('click', () => {
                handleSelect(lb, opt)
            })
        })
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 모달창을 초기화 하기위한 함수
 * 주요 기능 : 일정 생성, 일정 편집, 일정 상세보기 에서 바인딩되어 사용된 데이터들을 추기화하는 기능
 * 일정 모달창에서 사용된 카카오 맵을 초기화하는 기능
 */
function scheduleSubmitModalReload() {
    scheduleDisabled()
    document.getElementById('schedule_title').value = null;
    startDate.value = null;
    endDate.value = null;
    document.getElementById('schedule_content').value = null;
    document.getElementById('tagInput').value = null;
    document.getElementById('schedule_priority').value = 0;
    document.getElementById('schedule_priority_num').value = 0;
    document.getElementById('schedule_address_q').checked = false;
    document.getElementById('addressInput').value = null;
    document.getElementById('address').value = null;
    document.getElementById('addressLat').value = null;
    document.getElementById('addressHard').value = null;
    document.getElementById('keyword').value = null;
    document.getElementById('tagList').innerHTML = null;
    document.getElementById('completeLabel').innerHTML = '진행도 선택'
    document.getElementById('progress_label_icon').classList.add('hidden');
    document.getElementById('writeUser').innerText = null;
    document.querySelectorAll('.progress_label').forEach(function (lb) {
        lb.parentNode.classList.remove('active');
    })
    document.querySelector(".schedule_address_qLabel").classList.remove('view');
    document.querySelector('.progress_selectBox').classList.remove('view');

    removeMarker()
    show_map()
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 생성 모달창을 실행했을 경우 실행될 함수
 * 주요 기능 : 일정생성에 사용될 모달창의 데이터를 정의하고 인자로 받은 날짜가 있을경우 시작날짜를 인자로 바인딩후 모달창 표출
 */
function scheduleModalOpen(clickStart) {
    plus.style.display = "none"
    modal.style.display = "block";
    scheduleSubmitModal.style.display = 'block';
    resize()
    startDate.value = clickStart ? new Date(clickStart.getTime() - clickStart.getTimezoneOffset() * 60000).toISOString().slice(0, -8) : date;
    //startDate.min = date;
    endDate.min = date;
    document.getElementById('scheduleProgress').classList.add('hidden');
    document.getElementById('writeUserDiv').style.display = 'none'
    document.getElementsByClassName('schedule_save')[0].innerHTML = `<button class="schedule_save_btn" onclick="submitSchedule('post')">등록</button>`
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 상세페이지 모달창을 표출하는 함수
 * 주요 기능 : 선택한 일정 _id를 body로 실어 response받은 객체를통해 일정 상세모달데이터를 바인딩
 * 클릭한 유저와 작성자가 같을경우 일정을 편집 및 삭제할 수 있는 버튼 표출
 * 대쉬보드에서 상세보기만 원하는 모달일 경우 noEdit인자를 통해 편집불가 모달창 표출
 */
function scheduleViewModalOpen(scheduleId, noEdit) {
    modal.style.display = "block";
    if (scheduleListModal)
        scheduleListModal.style.display = 'none';
    const url = '/calendar/scheduleView'
    $.ajax({
        type: 'post',
        url: url,
        data: {
            scheduleId: scheduleId
        }, success: function (res) {
            // 일정 상세 모달에 사용될 데이터 바인딩 함수
            scheduleViewData(res);
            // 일정 상세 모달의 컨텐츠 영역의 크기를 내용에 맞게 조절
            resize()
            document.querySelector(".schedule_address_qLabel").classList.add('view');
            document.querySelector('.progress_selectBox').classList.add('view');
            // noEdit을통해 편집가능한 모달창인지 아닌지를 판단
            if (!noEdit) {
                // 선택한 일정의 작성자와 선택한 유저가 같을경우 편집 및 삭제 버튼 표출
                if (res.memberId == res.scheduleView.memberId._id) {
                    document.getElementsByClassName('schedule_save')[0].innerHTML = `<button class='schedule_save_btn' onclick='scheduleModalEditOpen(${JSON.stringify(res)})'>편집</button>` + `<button class='schedule_delete_btn' onclick="scheduleDelete('${res.scheduleView._id}')">삭제</button>`
                } else {
                    document.getElementsByClassName('schedule_save')[0].innerHTML = null
                }
            }
        }, error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 상세페이지에서 사용되는 데이터들을 바인딩 하는 함수
 * 주요 기능 : response된 객체를 인자로 받아 일정 상세페이지의 데이터들을 바인딩
 * 일정이 지도를 가지고 있을경우 지도표출되는 모달창 호출 없을경우 지도를 가지고있지 않은 모달창 표출
 */
function scheduleViewData(res) {
    res.scheduleView.tagId.map((data) => {
        addTagList(data.name);
    });
    let title = document.getElementById('schedule_title');
    let content = document.getElementById('schedule_content');
    let priority = document.getElementById('schedule_priority');
    let tagInput = document.getElementById('tagInput');
    let kakaoMapMenu = document.getElementById('menu_wrap');
    let scheduleProgress = document.getElementById('scheduleProgress');
    document.getElementById('writeUserDiv').style.display = 'flex'
    let writeUser = document.getElementById('writeUser');
    title.disabled = true;
    content.disabled = true;
    content.placeholder = ''
    priority.disabled = true;
    startDate.disabled = true;
    endDate.disabled = true;
    tagInput.style.display = 'none'
    document.getElementById('progress_label_icon').classList.add('hidden');
    scheduleProgress.classList.remove('hidden');
    label[0].removeEventListener('click', labelHandle);
    let tagDeleteIcon = document.getElementsByClassName("fa-regular fa-circle-xmark");
    // 태그를 삭제할수있는 아이콘 버튼 none처리
    for (let i = 0; i < tagDeleteIcon.length; i++) {
        tagDeleteIcon[i].style.display = 'none';
    }
    document.getElementById('completeLabel').innerHTML = res.scheduleView.completion ? document.getElementById("progress_optionItem2").innerHTML : document.getElementById("progress_optionItem1").innerHTML
    document.getElementById('schedule_address_q').disabled = true;
    kakaoMapMenu.style.display = 'none';
    title.value = res.scheduleView.title;
    let leftStartDate = new Date(res.scheduleView.startDate);
    let left = new Date(leftStartDate.getTime() - leftStartDate.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    startDate.value = left;
    let leftEndDate = new Date(res.scheduleView.endDate);
    left = new Date(leftEndDate.getTime() - leftEndDate.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    endDate.value = left;
    startDate.min = date;
    endDate.min = date;
    startDate.max = endDate.value;
    content.value = res.scheduleView.content;
    priority.value = res.scheduleView.priority;
    document.getElementById('schedule_priority_num').value = res.scheduleView.priority;
    // 일정상세에 지도가 있을경우 지도 표출
    if (res.scheduleView.map) {
        document.getElementById('schedule_address_q').checked = true;
        document.getElementById('addressInput').value = res.scheduleView.map.title;
        document.getElementById('address').value = res.scheduleView.map.address;
        document.getElementById('addressLat').value = res.scheduleView.map.y;
        document.getElementById('addressHard').value = res.scheduleView.map.x;
        var placePosition = new kakao.maps.LatLng(res.scheduleView.map.y, res.scheduleView.map.x);
        show_map(placePosition, 1, addMarker);
        document.getElementById('keyword').value = res.scheduleView.map.title;
    }
    writeUser.innerText = `작성자 : ${res.scheduleView.memberId.name}`
    modal.style.display = "block";
    scheduleSubmitModal.style.display = 'block';
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정삭제 버튼을 눌렀을 경우 일정을 삭제 시키는 함수
 * 주요 기능 : confirm을 통해 재확인을 시킨후 일정 _id를 통해 delete요청으로 일정 삭제
 */
function scheduleDelete(scheduleId) {
    if (!confirm("정말 삭제 하시겠습니까?")) {
        return
    }
    const url = '/schedule'
    $.ajax({
        type: 'delete',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({_id: scheduleId}),
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
 * 함수 설명 : 일정 상세모달창에서 일정 편집을 눌렀을경우 일정 편집 모달로 변경되는 함수
 * 주요 기능 : 일정상세모달창에서 disabled된 Element들을 abled로 되돌리는 함수 호출
 * 기존 존재하는 편집 삭제 버튼을 편집 완료버튼으로 변경
 */
function scheduleModalEditOpen(res) {
    document.querySelector(".schedule_address_qLabel").classList.remove('view');
    document.querySelector('.progress_selectBox').classList.remove('view');
    document.getElementsByClassName('schedule_save')[0].innerHTML = `<button class="schedule_save_btn" onclick="submitSchedule('patch', '${res.scheduleView._id}')">편집 완료</button>`
    scheduleDisabled()
    resize()
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 편집 및 일정생성에서 disabled된 Element들을 abled로 되돌리는 함수
 * 주요 기능 : 일정모달창의 Element들을 초기화 및 abled처리
 */
function scheduleDisabled() {
    let title = document.getElementById('schedule_title');
    let content = document.getElementById('schedule_content');
    let priority = document.getElementById('schedule_priority');
    let tagInput = document.getElementById('tagInput');
    let kakaoMapMenu = document.getElementById('menu_wrap');
    label[0].addEventListener('click', labelHandle)
    title.disabled = false;
    content.placeholder = '일정에 대한 상세 내용을 입력해 주세요.'
    content.disabled = false;
    priority.disabled = false;
    startDate.disabled = false;
    endDate.disabled = false;
    tagInput.style.display = 'block';
    document.getElementById('schedule_address_q').disabled = false;
    // 진행도의 Element css변경
    document.getElementById('progress_label_icon').classList.remove('hidden');
    let tagDeleteIcon = document.getElementsByClassName("fa-regular fa-circle-xmark");
    // 태그삭제 버튼을 재 활성
    for (let i = 0; i < tagDeleteIcon.length; i++) {
        tagDeleteIcon[i].style.display = 'block';
    }
    kakaoMapMenu.style.display = 'block';
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 모달창 닫기 함수
 * 주요 기능 : 일정 모달창을 닫을 경우 일정 모달창의 데이터들을 초기화시켜주는 함수를 호출하고 모달창 닫기 처리하는 기능
 */
function scheduleModalDone() {
    scheduleSubmitModalReload()
    modal.style.display = "none";
    tagModal.style.display = "none";
    scheduleSubmitModal.style.display = 'none';
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 캘린더 페이지에서 사용될 모달들을 각요소에 맞게 모달창 닫기 함수
 * 주요 기능 : 기존 모달창, 일정 모달창, 태그 모달창, 카테고리 모달창, 일정 리스트 모달창 들이 각요소이외의 요소에 클릭을 했을때 모달창을 닫히게하는 기능
 */
window.onclick = function (event) {
    let modalComponent = [modal, scheduleSubmitModal];
    if (modalComponent.includes(event.target)) {
        scheduleSubmitModalReload()
        modal.style.display = 'none';
        scheduleSubmitModal.style.display = 'none';
        tagModal.style.display = "none";
    }
    if (event.target == c_modal) {
        categoryModalReload();
        c_modal.style.display = "none";
    }
    if (event.target == scheduleListModal) {
        scheduleListModal.style.display = 'none';
    }
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 지도 checkbox 클릭 시 상세 정보 표시하는 함수
 */
var clickCheck = document.getElementById("map_wrap")
var addressInput = document.getElementById('addressInput');
var address = document.getElementById('address');
var addressLat = document.getElementById('addressLat');
var addressHard = document.getElementById('addressHard');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 생성 및 편집 모달창에서 주소등록 체크박스를 클릭했을때 카카오맵 표출및 감추기기능
 * 주요 기능 : 주소등록 체크여부를 통해 카카오 맵을 표출및 감추기하는 기능
 */
function show_map(placePosition, index, callback) {
    let cb = document.getElementById('schedule_address_q').checked
    let mc = document.getElementsByClassName('modal-content')[0]
    let ms = document.getElementById('modal_section')
    let tc = document.getElementsByClassName('tagModal-content')
    if (cb) {
        clickCheck.style.display = "block"
        addressInput.style.display = "block"
        mc.classList.add('show_address_modal-content')
        ms.classList.add('modal_section_div')
        tc[0].classList.add('show')
        // 카카오맵을 reload하기위한 setTime함수
        window.setTimeout(() => {
            map.relayout();
            // 마커의 위치가 맵이 load된 뒤에 실행하기위한 콜백 함수
            if (callback) {
                callback(placePosition, index);
            }
        }, 200)
    } else {
        clickCheck.style.display = "none"
        addressInput.style.display = "none"
        mc.classList.remove('show_address_modal-content')
        ms.classList.remove('modal_section_div')
        tc[0].classList.remove('show')
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 생성 및 편집 모달창에서 시작일이 종료일을 넘었을 경우 실행될 함수
 * 주요 기능 : 일정 시작일이 종료일보다 클경우 종료일을 넘은 시작일로 초기화 하고 알림 표출
 * 시작일과 종료일의 max, min값 재설정
 */
function DateValidation() {
    if (startDate.value) endDate.min = startDate.value;
    if (endDate.value) startDate.max = endDate.value;
    if (endDate.value) {
        if (startDate.value > endDate.value) {
            alert('종료일을 다시 정해주세요.');
            endDate.value = startDate.value;
        }
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 일정 등록 및 편집버튼을 클릭했을경우 편집및 등록API를 호출하는 함수
 * 주요 기능 : 필수 조건을 만족시키지 못할경우 커스텀 알림창을 표출
 * 인자로받은 type을 통해 편집및 생성 restApi 호출
 * 주소등록 체크여부를 통해 주소추가
 * 일정 생성및 편집에서 사용될 데이터 가공
 */
function submitSchedule(type, scheduleId) {
    let title = document.getElementById('schedule_title'), content = document.getElementById('schedule_content'),
        priority = document.getElementById('schedule_priority')
    if (!title.value) {
        return handleAlert("일정 제목을 입력해주세요.")
    }
    if (!endDate.value) {
        return handleAlert("일정 종료일을 입력해주세요.")
    }
    const url = '/schedule';
    let addressCheck = document.getElementById('schedule_address_q');
    // 태그의 리스트
    let tagList = document.getElementsByClassName("tagList")
    let progress = document.getElementById('completeLabel');
    // 진행도
    let complete = false
    if (progress.innerText == "완료") {
        complete = true;
    }
    const data = {
        _id: scheduleId ? scheduleId : null,
        startDate: startDate.value,
        endDate: endDate.value,
        title: title.value,
        content: content.value,
        priority: priority.value,
        map: addressCheck.checked && addressInput.value ? {
            title: addressInput.value, address: address.value, x: addressHard.value, y: addressLat.value
        } : null,
        tags: [],
        completion: complete
    }
    
    // 태그의 이름을 통해 데이터 가공
    for (let i = 0; i < tagList.length; i++) {
        data.tags.push(tagList[i].innerText);
    }

    $.ajax({
        type: type,
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            alert(res.message);
            location.reload()
        }, error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

