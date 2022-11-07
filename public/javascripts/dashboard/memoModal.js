let memoModal = document.getElementById('memoModal');

function memoModalOpen(memoId) {
    $.ajax({
        type: 'post',
        url: '/memo/view',
        contentType: 'application/json',
        data: JSON.stringify({memoId: memoId}),
        success: function (res) {
            document.getElementById('myScheduleSearch').value = null
            memoModalBind(res)
            document.getElementById('memoContent').value = res.memoData.content
            document.getElementById('memoDeleteButton').onclick = () => {
                deleteMemo(`${res.memoData._id}`);
                memoModalDone();
            }
            document.getElementById('memoSaveButton').onclick = () => {
                submitMemo(`${res.memoData._id}`);
            }
            document.getElementById('myScheduleSearch').onkeyup = () => {
                scheduleSearch(`${res.memoData._id}`)
            }
            let checkScheduleData = [];
            res.memoData.schedule.map((data) => {
                checkScheduleData.push(
                    `
                    <div id="${data._id}" onclick="scheduleViewModalOpen('${data._id}', true)" class="checkMySchedule">
                        <p class="scheduleTitle">${data.title}</p>
                    </div>
                    `
                )
            })
            document.getElementById('myScheduleCheckList').innerHTML = checkScheduleData.join('');
            memoModal.style.display = 'block';
        },
        error: function (err) {
            return alert(err.responseJSON.message);
        }
    })
}

function scheduleSearch(memoId) {
    $.ajax({
        type: 'post',
        url: '/memo/view/search',
        contentType: 'application/json',
        data: JSON.stringify({memoId: memoId, text: document.getElementById('myScheduleSearch').value}),
        success: function (res) {
            memoModalBind(res)
        },
        error: function (err) {
            return alert(err.responseJSON.message);
        }
    })
}

function memoModalBind(res) {
    let myScheduleData = [];

    res.myScheduleData.map((data) => {
        let myScheduleTagData = [];
        data.tagId.map((data, idx) => {
            if (idx > 3) {
                myScheduleTagData.push('...');
                return
            }
            myScheduleTagData.push(
                        `
                        #${data.name}
                        `
            )
        })
        let flag = res.memoData.schedule.find(value => value._id == data._id);
        myScheduleData.push(
            `
                    <div class="mySchedule">
                        <input onchange='scheduleCheck(${JSON.stringify(data)}, this)' type="checkbox" style="margin-right: 10px;" ${flag ? 'checked' : null}> 
                        <p class="scheduleTitle">${data.title}</p>
                        <p class="scheduleTag">${myScheduleTagData.join('')}</p>
                    </div>
                    `
        )
    })
    document.getElementById('myScheduleList').innerHTML = myScheduleData.join('')
}

function scheduleCheck(schedule, e) {
    let myScheduleList = document.getElementById('myScheduleCheckList');
    if (e.checked) {
        let checkSchedule = checkScheduleCreate(schedule);
        myScheduleList.appendChild(checkSchedule);
    } else {
        document.getElementById(`${schedule._id}`).remove();
    }
}

function checkScheduleCreate(schedule) {
    let newSchedule = document.createElement('div');
    newSchedule.id = schedule._id;
    newSchedule.className = 'checkMySchedule';
    newSchedule.innerHTML = `<p className="scheduleTitle">${schedule.title}</p>`
    return newSchedule
}

function submitMemo(memoId) {
    let content = document.getElementById('memoContent').value;
    let checkSchedule = document.getElementsByClassName('checkMySchedule');
    let data = {
        _id: memoId,
        content: content,
        schedules: [],
    }
    for (let i = 0; i < checkSchedule.length; i++) {
        data.schedules.push(checkSchedule[i].id);
    }
    if (content == '') {
        return alert("메모 내용이 비어있습니다.");
    }
    $.ajax({
        type: 'patch',
        url: '/memo',
        contentType: 'application/json',
        data: JSON.stringify({data: data}),
        success: function (res) {
            location.reload();
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function memoModalDone() {
    memoModal.style.display = 'none';
}

window.addEventListener('click', function (event) {
    if (event.target == memoModal) {
        memoModalDone();
    }
})


