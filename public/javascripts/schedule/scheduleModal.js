var modal = document.getElementById('scheduleModal');
var scheduleSubmitModal = document.getElementById('scheduleSubmitModal');
var scheduleViewModal = document.getElementById('scheduleViewModal');
var c_modal = document.getElementById('categoryModal');

var startDate = document.getElementById('schedule_start_day');
var endDate = document.getElementById('schedule_end_day');
var date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);

function scheduleSubmitModalReload() {
    document.getElementById('schedule_title').value = null;
    document.getElementById('schedule_start_day').value = null;
    document.getElementById('schedule_end_day').value = null;
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
    removeMarker()
    show_map()
}

function scheduleModalOpen() {
    plus.style.display = "none"
    modal.style.display = "block";
    scheduleSubmitModal.style.display = 'block';
    startDate.value = date;
    startDate.min = date;
    endDate.min = date;
    document.getElementsByClassName('schedule_save')[0].innerHTML=`<button class="schedule_save_btn" onclick="submitSchedule('post')">등록</button>`
}

function scheduleModalEditOpen(res) {
    scheduleViewModal.style.display = "none";
    document.getElementById('schedule_title').value = res.scheduleView.title;
    let leftStartDate = new Date(res.scheduleView.startDate);
    let left = new Date(leftStartDate.getTime() - leftStartDate.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    startDate.value = left;
    let leftEndDate = new Date(res.scheduleView.endDate);
    left = new Date(leftEndDate.getTime() - leftEndDate.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    endDate.value = left;
    startDate.min = date;
    endDate.min = date;
    startDate.max = endDate.value;
    document.getElementById('schedule_content').value = res.scheduleView.content;
    document.getElementById('schedule_priority').value = res.scheduleView.priority;
    document.getElementById('schedule_priority_num').value = res.scheduleView.priority;
    if(res.scheduleView.map){
        document.getElementById('schedule_address_q').checked =  true;
        document.getElementById('addressInput').value = res.scheduleView.map.title;
        document.getElementById('address').value = res.scheduleView.map.address;
        document.getElementById('addressLat').value = res.scheduleView.map.y;
        document.getElementById('addressHard').value = res.scheduleView.map.x;
        var placePosition = new kakao.maps.LatLng(res.scheduleView.map.y, res.scheduleView.map.x);
        addMarker(placePosition, 1);
        document.getElementById('keyword').value = res.scheduleView.map.title;
    }
    modal.style.display = "block";
    scheduleSubmitModal.style.display = 'block';
    document.getElementsByClassName('schedule_save')[0].innerHTML=`<button class="schedule_save_btn" onclick="submitSchedule('patch', '${res.scheduleView._id}')">편집 완료</button>`
    show_map();
}

function scheduleModalDone() {
    modal.style.display = "none";
    tagModal.style.display = "none";
    scheduleSubmitModal.style.display = 'none';
    scheduleViewModal.style.display = 'none';
    scheduleSubmitModalReload()
}

function categoryModalOpen() {
    c_modal.style.display = "block";
    plus.style.display = 'none'
}

function categoryModalDone() {  // 닫기 버튼이 안 먹히네요 ㅠ.ㅠ
    c_modal.style.display = "none";
}

window.onclick = function (event) {
    let modalComponent = [modal, scheduleViewModal, scheduleSubmitModal];
    if (modalComponent.includes(event.target)) {
        modal.style.display = 'none';
        scheduleSubmitModal.style.display = 'none';
        scheduleViewModal.style.display = 'none';
        tagModal.style.display = "none";
        scheduleSubmitModalReload()
    }
    if (event.target == c_modal) {
        c_modal.style.display = "none";
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

function show_map() {
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
    if (startDate.value)
        endDate.min = startDate.value;
    if (endDate.value)
        startDate.max = endDate.value;
    if (startDate.value > endDate.value) {
        alert('종료일을 다시 정해주세요.');
        endDate.value = startDate.value;
    }
}

function submitSchedule(type, scheduleId) {
    let title = document.getElementById('schedule_title'),
        content = document.getElementById('schedule_content'),
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
    const data = {
        _id: scheduleId ? scheduleId : null,
        startDate: startDate.value,
        endDate: endDate.value,
        title: title.value,
        content: content.value,
        priority: priority.value,
        map: addressCheck.checked ? {
            title: addressInput.value,
            address: address.value,
            x: addressHard.value,
            y: addressLat.value
        } : null,
        tags: [],
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
        },
        error: function (err) {
            return alert(err.responseJSON.message);
        }
    })
}

