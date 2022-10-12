let scheduleViewModal = document.getElementById('scheduleViewModal');
let c_modal = document.getElementById('categoryModal');

function categoryModalOpen() {
    c_modal.style.display = "block";
}

function categoryModalDone() {  // 닫기 버튼이 안 먹히네요 ㅠ.ㅠ
    c_modal.style.display = "none";
}


function scheduleViewModalDone() {
    scheduleViewModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == scheduleViewModal) {
        scheduleViewModal.style.display = "none";
    }
    if (event.target == c_modal) {
        c_modal.style.display = "none";
    }
}

