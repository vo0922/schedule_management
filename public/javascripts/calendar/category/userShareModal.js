/**
 * 담당자 : 박신욱
 * 함수 설명 : 공유 사용자 검색 하고 엔터를 입력할 경우 유저를 검색하는 함수
 */
function userSearchKeyUp() {
    if (window.event.keyCode == 13)
        userSearch();
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 공유사용자검색에 사용될 사용자 데이터를 가져오고 바인딩하는 함수
 * 주요 기능 : 검색할 유저를 제외한 유저를 검색 요청을 보낸후 response받은 데이터로 공유사용자 리스트 바인딩하는 기능
 */
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
                // 검색하는 유저 체크
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 공유사용자 모달창에서 사용자를 체크할 경우 카테고리 모달에 데이터를 바인딩 하는 함수
 * 주요 기능 : 체크 여부를 판단하여 공유 사용자 Element를 생성한 후 카테고리 공유사용자 영역에 Element를 추가 하는 기능
 * 체크를 해제 하였을 경우 해당 사용자를 카테고리 공유사용자 영역에서 제거
 */
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

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 모달창의 공유된 사용자를 바인딩 하는 함수
 * 주요 기능 : 공유된 사용자를 카테고리 공유 사용자 영역에 추가하는 기능
 */
function shareUserList(user) {
    let categoryShareUser = document.getElementById('category_share_user');
    let categoryShareUserDiv = shareUserCreate(user);
    categoryShareUser.appendChild(categoryShareUserDiv);
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 공유 사용자 영역에 들어갈 사용자 아바타 Element를 생성 하는 함수
 * 주요 기능 : user데이터를 통해 사용자 아바타 Element를 생성한후 생성된 Element반환
 */
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


