window.addEventListener('load', function () {
    memoList()
})

function memoScheduleHover(e) {
    let event = e.querySelectorAll('.memoSchedule');
    if (event) {
        for (let i = 0; i < event.length; i++) {
            event[i].classList.add('hover');
        }
    }
}

function memoScheduleNotHover(e) {
    let event = e.querySelectorAll('.memoSchedule');
    if (event) {
        for (let i = 0; i < event.length; i++) {
            event[i].classList.remove('hover');
        }
    }
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
                    <input class="hiddenDate" type="hidden" value="${data.date}">
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
            console.log(err);
            return alert(err.responseJSON.message);
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
                memoEl.onmouseover = () => {
                    memoScheduleHover(memoEl)
                };
                memoEl.onmouseout = () => {
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
                    <input class="hiddenDate" type="hidden" value="${res.data.date}">
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
                console.log(err);
                return alert(err.responseJSON.message);
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
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

function sortMenu() {
    let menu = document.querySelector('.sortMenu');
    menu.classList.toggle('active')
}

function sort(type) {
    let menu = document.querySelector('.sortMenu');
    menu.classList.toggle('active')
    let memoData = document.querySelectorAll('.memoDiv');
    let memoSort = [];
    for (let i = 0; i < memoData.length; i++) {
        memoSort.push(memoData[i]);
    }
    let result;
    if(type == 'asc'){
        result = sortAsc(memoSort);
    }else {
        result = sortDesc(memoSort);
    }
    document.getElementById('memoList').innerHTML = null;
    result.map((data) => {
        document.getElementById('memoList').appendChild(data);
    })
}

function sortAsc(memoSort) {
    let result = memoSort.sort((a, b) => {
        let first = new Date(a.querySelector(".hiddenDate").value);
        let second = new Date(b.querySelector(".hiddenDate").value);
        if(first > second) {
            return 1;
        } else {
            return -1;
        }
        return 0;
    })
    return result;

}

function sortDesc(memoSort) {
    let result = memoSort.sort((a, b) => {
        let first = new Date(a.querySelector(".hiddenDate").value);
        let second = new Date(b.querySelector(".hiddenDate").value);
        if(first < second) {
            return 1;
        } else {
            return -1;
        }
        return 0;
    })
    return result;
}