function scheduleViewModalOpen(scheduleId) {
    scheduleViewModal.style.display = "block";
    const url = '/calendar/scheduleView'
    $.ajax({
        type: 'post',
        url: url,
        data: {
            scheduleId: scheduleId
        },
        success: function (res) {
            document.getElementById('title').innerText = res.scheduleView.title;
            document.getElementById('startDate').innerText = res.scheduleView.startDate;
            document.getElementById('endDate').innerText = res.scheduleView.endDate;
            document.getElementById('content').innerText = res.scheduleView.content;
            document.getElementById('priority').innerText = res.scheduleView.priority;
        },
        error: function (err) {
            console.log(err);
        }
    })
}

