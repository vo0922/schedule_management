let modal = document.getElementById('scheduleModal');

function scheduleModalOpen() {
    modal.style.display = "block";
    map.relayout();
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
function show_map() {
    if (clickCheck.style.display === "none") {
        clickCheck.style.display = "block"
    } else {
        clickCheck.style.display = "none"
    }
}