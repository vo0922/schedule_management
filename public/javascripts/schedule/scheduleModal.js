var modal = document.getElementById('scheduleModal');
var scheduleSubmitModal = document.getElementById('scheduleSubmitModal');
var c_modal = document.getElementById('categoryModal');
var scheduleListModal = document.getElementById('scheduleListModal');

var startDate = document.getElementById('schedule_start_day');
var endDate = document.getElementById('schedule_end_day');
var date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);

let aleartFlag = 0;

function handleLine(e, line) {
    if (e.value.length > line) {
        e.value = e.value.substr(0, line);
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
    document.querySelectorAll('.progress_label').forEach(function (lb) {
        lb.parentNode.classList.remove('active');
    })

    removeMarker()
    show_map()
}

function scheduleModalOpen(clickStart) {
    plus.style.display = "none"
    modal.style.display = "block";
    scheduleSubmitModal.style.display = 'block';
    startDate.value = clickStart ? new Date(clickStart.getTime() - clickStart.getTimezoneOffset() * 60000).toISOString().slice(0, -8) : date;
    //startDate.min = date;
    endDate.min = date;
    document.getElementById('scheduleProgress').classList.add('hidden');
    document.getElementsByClassName('schedule_save')[0].innerHTML = `<button class="schedule_save_btn" onclick="submitSchedule('post')">등록</button>`
}

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
            scheduleViewData(res);
            if(!noEdit){
                if (res.memberId == res.scheduleView.memberId) {
                    document.getElementsByClassName('schedule_save')[0].innerHTML = `<button class='schedule_save_btn' onclick='scheduleModalEditOpen(${JSON.stringify(res)})'>편집</button>` + `<button class='schedule_delete_btn' onclick="scheduleDelete('${res.scheduleView._id}')">삭제</button>`
                } else {
                    document.getElementsByClassName('schedule_save')[0].innerHTML = null
                }
            }
        }, error: function (err) {
            console.log(err);
        }
    })
}

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
    modal.style.display = "block";
    scheduleSubmitModal.style.display = 'block';
}

function scheduleDelete(scheduleId) {
    if(!confirm("정말 삭제 하시겠습니까?")){
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
            return alert(err.responseJSON.message);
        }
    })
}

function scheduleModalEditOpen(res) {
    document.getElementsByClassName('schedule_save')[0].innerHTML = `<button class="schedule_save_btn" onclick="submitSchedule('patch', '${res.scheduleView._id}')">편집 완료</button>`
    scheduleDisabled()
}

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
    document.getElementById('progress_label_icon').classList.remove('hidden');
    let tagDeleteIcon = document.getElementsByClassName("fa-regular fa-circle-xmark");
    for (let i = 0; i < tagDeleteIcon.length; i++) {
        tagDeleteIcon[i].style.display = 'block';
    }
    kakaoMapMenu.style.display = 'block';
}

function scheduleModalDone() {
    modal.style.display = "none";
    tagModal.style.display = "none";
    scheduleSubmitModal.style.display = 'none';
    scheduleSubmitModalReload()
}

window.onclick = function (event) {
    let modalComponent = [modal, scheduleSubmitModal];
    if (modalComponent.includes(event.target)) {
        modal.style.display = 'none';
        scheduleSubmitModal.style.display = 'none';
        tagModal.style.display = "none";
        scheduleSubmitModalReload()
    }
    if (event.target == c_modal) {
        c_modal.style.display = "none";
        categoryModalReload();
    }
    if (event.target == scheduleListModal) {
        scheduleListModal.style.display = 'none';
    }
}

/*=============== 지도 checkbox 클릭 시 상세 정보 표시 ===============*/
var clickCheck = document.getElementById("map_wrap")
var addressInput = document.getElementById('addressInput');
var address = document.getElementById('address');
var addressLat = document.getElementById('addressLat');
var addressHard = document.getElementById('addressHard');

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
        window.setTimeout(() => {
            map.relayout();
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

function submitSchedule(type, scheduleId) {
    let title = document.getElementById('schedule_title'), content = document.getElementById('schedule_content'),
        priority = document.getElementById('schedule_priority')
    if (!title.value) {
        return alert('일정 제목을 작성해주세요.');
    }
    if (!endDate.value) {
        return alert('일정 종료일을 선택해주세요.')
    }
    const url = '/schedule';
    let addressCheck = document.getElementById('schedule_address_q');
    let tagList = document.getElementsByClassName("tagList")
    let progress = document.getElementById('completeLabel');
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
        map: addressCheck.checked ? {
            title: addressInput.value, address: address.value, x: addressHard.value, y: addressLat.value
        } : null,
        tags: [],
        completion: complete
    }

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
            return alert(err.responseJSON.message);
        }
    })
}

