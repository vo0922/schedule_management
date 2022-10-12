function scheduleViewModalOpen(scheduleId) {
    modal.style.display = "block";
    scheduleViewModal.style.display = "block";
    const url = '/calendar/scheduleView'
    $.ajax({
        type: 'post',
        url: url,
        data: {
            scheduleId: scheduleId
        },
        success: function (res) {
            res.scheduleView.tagId.map((data) => {
                addTagList(data.name);
            });
            document.getElementById('title').innerText = res.scheduleView.title;
            document.getElementById('startDate').innerText = res.scheduleView.startDate;
            document.getElementById('endDate').innerText = res.scheduleView.endDate;
            document.getElementById('content').innerText = res.scheduleView.content;
            document.getElementById('priority').innerText = res.scheduleView.priority;
            if (res.memberId == res.scheduleView.memberId) {
                document.getElementById('editOpenButton').innerHTML = `<button onclick='scheduleModalEditOpen(${JSON.stringify(res)})'>편집</button>`
                document.getElementById('deleteButton').innerHTML = `<button onclick="scheduleDelete('${res.scheduleView._id}')">삭제</button>`
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function scheduleDelete(scheduleId) {
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


