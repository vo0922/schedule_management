window.addEventListener('load', function () {
    memoList()
})

function memoList() {
    $.ajax({
        type: 'get',
        url: '/memo',
        success: function (res) {
            let memoListData = []
            res.data.map((data) => {
                memoListData.push(`
                    <div id="${data._id}" class="memoContent">
                    <p class="memoText">${data.content}</p>
                    <div class="memoIcon">
                    ${data.schedule.length ? '<i class="fa-solid fa-star" style="color: #ffd700"></i>' : '<i class="fa-regular fa-star"></i>'}
                    <i onclick="deleteMemo('${data._id}')" class="fa-regular fa-trash-can"></i>
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
                let memoEl = document.createElement('div');
                memoEl.className = 'memoContent';
                memoEl.id = `${res.data._id}`
                memoEl.innerHTML = `<p class="memoText">${res.data.content}</p>
                    <div class="memoIcon">
                    ${res.data.schedule.length ? '<i class="fa-solid fa-star" style="color: #ffd700"></i>' : '<i class="fa-regular fa-star"></i>'}
                    <i onclick="deleteMemo('${res.data._id}')" class="fa-regular fa-trash-can"></i>
                    </div>`
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