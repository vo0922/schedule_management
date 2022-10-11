let c_modal = document.getElementById('categoryModal');

function categoryModalOpen() {
    c_modal.style.display = "block";
}

function categoryModalDone() {  // 닫기 버튼이 안 먹히네요 ㅠ.ㅠ
    c_modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == c_modal) {
        c_modal.style.display = "none";
    }
}
