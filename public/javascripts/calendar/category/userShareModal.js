function userSearchKeyUp() {
    if (window.event.keyCode == 13)
        userSearch();
}

function userSearch() {
    let userListDiv = document.getElementById('userListDiv')
    let userListHtml = []
    let myEmail = document.querySelector('.user_share_info_email');
    const url = '/category/userSearch'
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({text: document.getElementById('userSearchText').value}),
        success: function (res) {
            res.data.map((data) => {
                let userShareCheck = document.getElementById(`${data._id}`);
                if(!(myEmail.innerText == data.email)){
                    userListHtml.push(
                        `<div class="user_share user_share_userList">\n` +
                        `<input onchange='shareUserCheck(${JSON.stringify(data)}, this)' type="checkbox" id="user_share_userList_cb" name="user_share_userList_cb" class="user_share_userList_cb" ${userShareCheck ? 'checked' : ''}/>\n` +
                        `<div class="user_share_userList_img">\n` +
                        `<img src="${data.profile}">\n` +
                        `</div>\n` +
                        `<p class="user_share_userList_name">${data.name}</p>\n` +
                        `<p class="user_share_userList_email">${data.email}</p>\n` +
                        `</div>`
                    )
                }
            })
            userListDiv.innerHTML = userListHtml.join("");
        },
        error: function (err) {
            console.log(err);
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
        let tooltipList = document.getElementsByClassName('tooltip');
        for(let i = 0; i < tooltipList.length; i++) {
            tooltipList[i].style.left = `${(i%8) * -20}px`
        }
    }
}

function shareUserList(user) {
    let categoryShareUser = document.getElementById('category_share_user');
    let categoryShareUserDiv = shareUserCreate(user);
    categoryShareUser.appendChild(categoryShareUserDiv);
}

function shareUserCreate(user) {
    let tooltipDiv = document.createElement('div');
    let tooltipList = document.getElementsByClassName('tooltip');
    tooltipDiv.className = 'tooltip';
    tooltipDiv.style.left = `${(tooltipList.length % 8) * -20}px`
    
    tooltipDiv.id = `${user._id}`;
    tooltipDiv.innerHTML =
        `<img src="${user.profile}">\n` +
        `<span class="tooltip-text">\n` +
        `<p>이름: ${user.name}</p>\n` +
        `<p>이메일: ${user.email}</p>\n` +
        `</span>\n`;
    return tooltipDiv;
}


