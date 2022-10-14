function userSearchKeyUp() {
    if (window.event.keyCode == 13)
        userSearch();
}

function userSearch() {
    let userListDiv = document.getElementById('userListDiv')
    let userListHtml = []
    const url = '/category/userSearch'
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({text: document.getElementById('userSearchText').value}),
        success: function (res) {
            res.data.map((data) => {
                let userShareCheck = document.getElementById(`${data._id}`);
                userListHtml.push(
                    `<div class="user_share user_share_userList">\n` +
                    `<input onchange='shareUserCheck(${JSON.stringify(data)}, this)' type="checkbox" id="user_share_userList_cb" name="user_share_userList_cb" class="user_share_userList_cb" ${userShareCheck ? 'checked':''}/>\n` +
                    `<div class="user_share_userList_img">\n` +
                    `<img src="${data.profile}">\n` +
                    `</div>\n` +
                    `<p class="user_share_userList_name">${data.name}</p>\n` +
                    `<p class="user_share_userList_email">${data.email}</p>\n` +
                    `</div>`
                )
            })
            userListDiv.innerHTML = userListHtml.join("");
        },
        error: function (err) {
            return alert(err.responseJSON.message);
        }
    })
}

function shareUserCheck(user, e) {
    let categoryShareUser = document.getElementById('category_share_user');
    if (e.checked) {
        let categoryShareUserDiv = shareUserCreate(user);
        categoryShareUser.appendChild(categoryShareUserDiv);
    } else {
        document.getElementById(`${user._id}`).remove();
    }
}

function shareUserCreate(user) {
    let tooltipDiv = document.createElement('div');
    tooltipDiv.className = 'tooltip';
    tooltipDiv.id = `${user._id}`;
    tooltipDiv.innerHTML =
        `<img src="${user.profile}">\n` +
        `<span class="tooltip-text">\n` +
        `<p>이름: ${user.name}</p>\n` +
        `<p>이메일: ${user.email}</p>\n` +
        `</span>\n`;
    return tooltipDiv;
}
document.getElementById('category_share_user_list_add').addEventListener('click', function() {
  
  document.getElementsByClassName('category-modal-content')[0].className = "show_category-modal-content"
  document.getElementsByClassName('category_modal_section')[0].className = "category_modal_section_div"
  document.getElementById('category_modal_section2').style.display = "block"
  // document.getElementsByClassName('category_modal_section')[1].className = 'category_modal_section_border'
})