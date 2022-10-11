let modal = document.getElementById('scheduleModal');

function scheduleModalOpen() {
    modal.style.display = "block";
}

function scheduleModalDone() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/*=============== 지도 checkbox 클릭 시 상세 정보 표시 ===============*/
let clickCheck = document.getElementById("map_wrap")
let addressInput = document.getElementById('addressInput');
let address = document.getElementById('address');
let addressLat = document.getElementById('addressLat');
let addressHard = document.getElementById('addressHard');

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

let startDate = document.getElementById('schedule_start_day');
let endDate = document.getElementById('schedule_end_day');
let date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
startDate.value = date;
startDate.min = date;
endDate.min = date;

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

function submitSchedule() {
    let title = document.getElementById('schedule_title'),
        content = document.getElementById('schedule_content'),
        priority = document.getElementById('schedule_priority')
    if (!title.value) {
        return alert('일정 제목을 작성해주세요.');
    }
    if (!endDate.value) {
        return alert('일정 종료일을 선택해주세요.')
    }
    const url = '/schedule'
    let addressCheck = document.getElementById('schedule_address_q');
    let tagList = document.getElementsByClassName("tagList")
    const data = {
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

    console.log(data);
    $.ajax({
        type: 'post',
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
