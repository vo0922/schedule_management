/**
 * 담당자 : 이승현
 * 함수 설명 : 카테고리 생성을 눌렀을 때 카테고리 생성 모달창을 띄우는 함수
 * 주요 기능 : 새로운 카테고리를 생성할 수 있는 생성 모달창을 띄워 줍니다.
 */
function categoryModalOpen() {
    c_modal.style.display = "block";
    document.getElementById('categoryColor').value = '#f08080';
    document.getElementsByClassName('category category_save')[0].innerHTML = `<button class="category_save_btn" onclick="submitCategory('post')">등록</button>`
    plus.style.display = 'none'
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 카테고리 모달창을 닫는 함수
 * 주요 기능 : 닫기 버튼을 클릭했을 때 카테고리 모달창을 닫아 줍니다.
 */
function categoryModalDone() {
    c_modal.style.display = "none";
    categoryModalReload();
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 만들기 Element 이외의 Element클릭 시 일정 생성 및 카테고리 메뉴 모달 닫기 함수
 */
window.addEventListener('click', function (e) {
    let plusModal = document.querySelector('.plus');
    if(!(plusModal.getElementsByClassName(e.target.className).length || e.target.className == 'plus')) {
        plus.style.display = 'none'
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 클릭한 카테고리를 수정하는 모달창을 띄우는 함수
 * 주요 기능 : 클릭한 카테고리 _id를 데이터로 요청을 보내 카테고리 모달에 데이터를 바인딩 하는 기능
 */
function categoryEditModalOpen(categoryId) {
    event.stopPropagation();
    const url = '/category/search'
    let title = document.getElementById('category_title');
    let shareCheck = document.getElementById('category_share_q');
    let categorySubmitButton = document.getElementsByClassName('category category_save')[0];
    let color = document.getElementById('categoryColor');
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({_id: categoryId}),
        success: function (res) {
            title.value = res.data.name;
            color.value = res.data.color;
            // 기존 카테고리의 연결된 태그들을 바인딩
            res.data.tagId.map((data) => {
                addCategoryTagList(data.name, data._id);
            })
            // 카테고리에 공유된 사용자가 있을경우 사용자 공유 체크와 공유 모달창 오픈
            if (res.data.shareMemberId.length) {
                shareCheck.checked = true;
                share_user()
                // 공유된 사용자를 바인딩 하기위한 함수
                res.data.shareMemberId.map((data) => {
                    shareUserList(data);
                })
            }
            categorySubmitButton.innerHTML = `<button class="category_save_btn" onclick="submitCategory('patch','${res.data._id}')">편집 완료</button>`
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
    categoryModalOpen();
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 공유할 사용자 추가 여부 체크되었을 경우의 함수
 * 주요 기능 : 공유할 사용자 추가하겠다는 체크박스 체크 시 사용자 목록을 보여 줍니다.
 */
function share_user() {
    let cb = document.getElementById('category_share_q').checked
    let shareList = document.getElementById('checkShareUser_list')
    if (cb) {
        shareList.style.display = "block"
    } else {
        shareList.style.display = "none"
        // 체크 해제 시 사용자 목록 모달창을 닫는 함수
        shareUserModalDone()
    }
}

let categoryTagModal = document.getElementById('categoryTagModal');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 모달창에서 태그를 검색할 경우의 함수
 * 주요 기능 : 태그를 검색할 경우 태그 모달창을 보여주고 태그 모달창에서 태그 데이터를 바인딩
 */
function selectCategoryTag(text) {
    let tagList = document.getElementById('categoryTagList');
    const url = '/tag/change'
    $.ajax({
        type: 'post',
        url: url,
        data: {
            text: text
        },
        success: function (res) {
            let tagDiv = '';
            if (!res.data)
                return categoryTagModal.style.display = "none";
            else {
                categoryTagModal.style.display = "block";
            }

            res.data.map((data) => {
                tagDiv += `<div class='tagDiv' onclick="addCategoryTagList('${data.name}','${data._id}')"><p>#</p><p>${data.name}</p></div>`
            })
            tagList.innerHTML = tagDiv
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 모달창에서 태그를 검색할 시 실행될 함수
 * 주요 기능 : 검색한 태그 내용을 정규식을통해 특수문자 체크 후 #이 포함된 내용이라면 #을 제거 하고 태그 검색 요청
 * 검색 내용이 없을경우 태그 모달창 닫기
 */
function categoryTagInput(e) {
    // #을 제외한 특수문자 정규식
    let specialRule = /[\{\}\[\]\/?.,;:|\)*~`!^\+<>@\$%&\\\=\(\'\"]/gi
    if(specialRule.test(e.value)) {
        return e.value = e.value.slice(0, -1);
    }
    let tagHash = e.value.replace('#', '');
    if (!e.value)
        return categoryTagModal.style.display = "none";
    selectCategoryTag(tagHash)
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 태그 모달창에서 태그를 클릭 할 경우 클릭한 태그를 카테고리 모달에 바인딩하는 함수
 * 주요 기능 : 선택한 태그를 통해 태그 이름으로 새로운 Element를 만들고 만들어진 태그 Element를 바인딩
 */
function addCategoryTagList(text, id) {
    let tagInput = document.getElementById('categoryTagInput')
    let newTag = createElements(text);
    newTag.id = id;
    // 이미 바인딩 되어있는 태그가 존재할 경우 알림창 리턴
    let leftTag = document.getElementsByClassName(text)[0];
    if (leftTag) {
        categoryTagModal.style.display = "none";
        return alert("이미 태그가 존재합니다.");
    }
    let tagDiv = document.getElementById('categoryTagDivList');
    tagDiv.appendChild(newTag);
    tagInput.value = '';
    categoryTagModal.style.display = "none";
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 모달창을 초기화 하기위한 함수
 * 주요 기능 : 카테고리 생성 및 편집 모달창에 사용될 카테고리 모달창의 바인딩되어있는 데이터들을 초기화후 모달창 닫기하는 기능
 */
function categoryModalReload() {
    let shareList = document.getElementById('checkShareUser_list')
    document.getElementById('category_title').value = null;
    document.getElementById('categoryTagInput').value = null;
    document.getElementById('categoryTagDivList').innerHTML = null;
    document.getElementById('category_share_q').checked = false;
    document.getElementById('category_share_user').innerHTML = null;
    document.getElementById('userListDiv').innerHTML = null;
    document.getElementById('userSearchText').value = null;
    document.getElementById('categoryColor').value = '#f08080';
    shareUserModalDone()
    shareList.style.display = "none"
    categoryTagModal.style.display = "none";
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 사용자 공유 여부 체크 해제 시 사용자 목록 모달창을 닫는 함수
 * 주요 기능 : 사용자 공유 여부 체크 해제 시 원래의 카테고리 모달창의 형태로 돌아가기 위해 체크되었을 때 추가된 클래스들을 제거해 줍니다.
 */
function shareUserModalDone() {
    document.getElementsByClassName('category-modal-content')[0].classList.remove('show')
    document.getElementsByClassName('category_modal_section')[0].classList.remove('div')
    document.getElementById('category_modal_section2').style.display = "none"
    document.getElementsByClassName('category_modal_section')[2].classList.remove('border');
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 사용자 공유 여부 체크 시 사용자 목록 모달창을 여는 함수
 * 주요 기능 : 사용자 공유 여부 체크 시, 체크되었을 때 카테고리 모달창의 형태로 바뀌기 위해 체크되었을 때 추가되어야 하는 클래스들을 추가해 줍니다.
 */
function extendsUserList() {
    document.getElementsByClassName('category-modal-content')[0].classList.add('show')
    document.getElementsByClassName('category_modal_section')[0].classList.add('div')
    document.getElementById('category_modal_section2').style.display = "block"
    document.getElementsByClassName('category_modal_section')[2].classList.add('border');
    // 공유사용자검색에 사용될 사용자 데이터를 가져오고 바인딩하는 함수
    userSearch();
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카테고리 등록하기 및 편집하기 버튼을 눌렀을 경우 실행 되는 함수
 * 주요 기능 : ajax요청으로 보낼 type과 카테고리 _id를 인자로 받아 카테고리 생성과 편집을 처리하는 기능
 */
function submitCategory(type, categoryId) {
    let shareCheck = document.getElementById('category_share_q');
    let title = document.getElementById('category_title').value;
    if(title == '') {
        return alert("카테고리 제목을 입력해주세요.");
    }
    let tagList = document.getElementsByClassName("tagListDiv");
    let shareUser = document.getElementsByClassName('tooltip');
    let color = document.getElementById('categoryColor');
    // ajax요청으로 보낼 데이터를 가공
    let data = {
        _id: categoryId,
        name: title,
        shareCheck: shareCheck.checked,
        tagIds: [],
        shareMemberIds: [],
        color: color.value
    }
    for (let i = 0; i < tagList.length; i++) {
        data.tagIds.push(tagList[i].id);
    }
    // 사용자 공유 체크박스가 체크되었을 경우만 공유 유저 추가
    if (shareCheck.checked) {
        for (let i = 0; i < shareUser.length; i++) {
            data.shareMemberIds.push(shareUser[i].id);
            
        }
    }
    const url = '/category';

    $.ajax({
        // restApi 로 type에따른 카테고리 crud
        type: type,
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            alert(res.message);
            location.reload();
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}