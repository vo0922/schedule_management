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
    if (clickCheck.style.display === "none") {
        clickCheck.style.display = "block"
        addressInput.style.display = "block"
        map.relayout();
    } else {
        clickCheck.style.display = "none"
        addressInput.style.display = "none"
    }
}

function submitSchedule() {
    const url = '/schedule'
    let addressCheck = document.getElementById('schedule_address_q');
    let tagList = document.getElementsByClassName("tagList")
    const data = {
        startDate: document.getElementById('schedule_start_day').value,
        endDate: document.getElementById('schedule_end_day').value,
        title: document.getElementById('schedule_title').value,
        content: document.getElementById('schedule_content').value,
        priority: document.getElementById('schedule_priority').value,
        map: addressCheck.checked ?{
            title: addressInput.value,
            address: address.value,
            x: addressHard.value,
            y: addressLat.value
        }: null,
        tags: [],
    }

    for (let i = 0; i < tagList.length; i++) {
        data.tags.push(tagList[i].innerText);
    }

    console.log(data);
     $.ajax({
         type: 'post',
         url: url,
         contentType : 'application/json',
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