window.addEventListener('load', function () {
    memoList()
})

function memoScheduleHover(e) {
    if(e.querySelector('.memoSchedule'))
        e.querySelector('.memoSchedule').classList.add('hover')
}

function memoScheduleNotHover(e) {
    if(e.querySelector('.memoSchedule'))
        e.querySelector('.memoSchedule').classList.remove('hover')
}
function memoList() {
    $.ajax({
        type: 'get',
        url: '/memo',
        success: function (res) {
            let memoListData = []
            res.data.map((data) => {
                let memoScheduleData = [];
                data.schedule.map((schedule) => {
                    memoScheduleData.push(
                        `<div class="memoSchedule">
                        <i class="fa-solid fa-circle" style="color: #f08080"></i> <p>${schedule.title}</p>
                        </div>`
                    )
                })
                memoListData.push(`
                    <div id="${data._id}" class="memoDiv" onmouseover="memoScheduleHover(this)" onmouseout="memoScheduleNotHover(this)" onclick="memoModalOpen('${data._id}')">
                    <div class="memoContent">
                    <p class="memoText">${data.content}</p>
                    <div class="memoIcon">
                    <i onclick="deleteMemo('${data._id}')" class="fa-regular fa-trash-can"></i>
                    </div>
                    </div>
                    <div class="memoScheduleList">
                    ${memoScheduleData.join('')}
                    </div>
                    </div>
                `)
            })
            document.getElementById('memoList').innerHTML = memoListData.join('');
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function addMemo(e) {
    if (window.event.keyCode == 13) {
        if (!e.value) {
            return
        }
        $.ajax({
            type: 'post',
            url: '/memo',
            contentType: 'application/json',
            data: JSON.stringify({content: e.value}),
            success: function (res) {
                let memoScheduleData = [];
                let memoEl = document.createElement('div');
                memoEl.className = 'memoDiv';
                memoEl.id = `${res.data._id}`
                memoEl.onmouseover =()=> {
                    memoScheduleHover(memoEl)
                };
                memoEl.onmouseout = ()=> {
                    memoScheduleNotHover(memoEl)
                };
                memoEl.onclick = () => {
                    memoModalOpen(`${res.data._id}`)
                };
                res.data.schedule.map((schedule) => {
                    memoScheduleData.push(
                        `<div class="memoSchedule">
                        <i class="fa-solid fa-circle" style="color: #f08080"></i> <p>${schedule.title}</p>
                        </div>`
                    )
                })
                memoEl.innerHTML = `
                    <div class="memoContent">
                    <p class="memoText">${res.data.content}</p>
                    <div class="memoIcon">
                    <i onclick="deleteMemo('${res.data._id}')" class="fa-regular fa-trash-can"></i>
                    </div>
                    </div>
                    <div class="memoScheduleList">
                    ${memoScheduleData.join('')}
                    </div>
                `
                document.getElementById('memoList').appendChild(memoEl);
                e.value = null;
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
}

function deleteMemo(memoId) {
    event.stopPropagation();
    $.ajax({
        type: 'delete',
        url: '/memo',
        contentType: 'application/json',
        data: JSON.stringify({memoId: memoId}),
        success: function (res) {
            document.getElementById(`${memoId}`).remove();
        },
        error: function (err) {
            console.log(err)
        }
    })
}
