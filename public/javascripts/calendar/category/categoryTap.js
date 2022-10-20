function tabClick(e) {
    let tab_link = document.getElementsByClassName('tab-link')
    for (let i = 0; i < tab_link.length; i++) {
        tab_link[i].classList.remove('current');
    }
    e.classList.add('current');
    let tab_id = e.getAttribute('data-tab');
    let tab_content = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tab_content.length; i++) {
        tab_content[i].classList.remove('current');
    }
    document.getElementById(tab_id).classList.add('current');
    switch (e.innerText) {
        case "나의 일정":

            break
        case "공유 일정":
            allShareSchedule();
            break
        case "전체":
            allCategorySchedule();
            break
        default:
            return
    }
}


function categoryDelete(categoryId, name) {
    if (!confirm(`${name} 카테고리를 삭제 하시겠습니까?`)) {
        return
    }
    const url = '/category'
    $.ajax({
        type: 'delete',
        contentType: 'application/json',
        url: url,
        data: JSON.stringify({categoryId: categoryId}),
        success: function (res) {
            alert(res.message);
            location.reload()
        },
        error: function (err) {
            console.log(err);
        }
    })
}