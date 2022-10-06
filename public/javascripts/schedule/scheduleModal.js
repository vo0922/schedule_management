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