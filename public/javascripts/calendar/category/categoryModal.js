function categoryModalOpen() {
    c_modal.style.display = "block";
    document.getElementsByClassName('category category_save')[0].innerHTML = `<button class="category_save_btn" onclick="submitCategory('post')">등록</button>`
    plus.style.display = 'none'
}

function categoryModalDone() {
    c_modal.style.display = "none";
    categoryModalReload();
}

function categoryEditModalOpen(categoryId) {
    const url = '/category/search'
    let title = document.getElementById('category_title');
    let shareCheck = document.getElementById('category_share_q');
    let categorySubmitButton = document.getElementsByClassName('category category_save')[0];
    $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({_id: categoryId}),
        success: function (res) {
            title.value = res.data.name;
            res.data.tagId.map((data) => {
                addCategoryTagList(data.name, data._id);
            })
            if (res.data.shareMemberId.length) {
                shareCheck.checked = true;
                share_user()
                res.data.shareMemberId.map((data) => {
                    shareUserList(data);
                })
            }
            categorySubmitButton.innerHTML = `<button class="category_save_btn" onclick="submitCategory('patch','${res.data._id}')">편집 완료</button>`
        },
        error: function (err) {
            console.log(err);
        }
    })
    categoryModalOpen();
}

/*=============== 공유 옵션 checkbox 클릭 시 정보 표시 ===============*/
function share_user() {
    let cb = document.getElementById('category_share_q').checked
    let shareList = document.getElementById('checkShareUser_list')
    if (cb) {
        shareList.style.display = "block"
    } else {
        shareList.style.display = "none"
        shareUserModalDone()
    }
}

let categoryTagModal = document.getElementById('categoryTagModal');

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
        }
    })
}

function categoryTagInput(e) {
    let tagHash = e.value.replace('#', '');
    if (!e.value)
        return categoryTagModal.style.display = "none";
    selectCategoryTag(tagHash)
}


function addCategoryTagList(text, id) {
    let tagInput = document.getElementById('categoryTagInput')
    let newTag = createElements(text);
    newTag.id = id;
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

function categoryModalReload() {
    let shareList = document.getElementById('checkShareUser_list')
    document.getElementById('category_title').value = null;
    document.getElementById('categoryTagInput').value = null;
    document.getElementById('categoryTagDivList').innerHTML = null;
    document.getElementById('category_share_q').checked = false;
    document.getElementById('category_share_user').innerHTML = null;
    document.getElementById('userListDiv').innerHTML = null;
    document.getElementById('userSearchText').value = null;
    shareUserModalDone()
    shareList.style.display = "none"
    categoryTagModal.style.display = "none";
}

function shareUserModalDone() {
    document.getElementsByClassName('category-modal-content')[0].classList.remove('show')
    document.getElementsByClassName('category_modal_section')[0].classList.remove('div')
    document.getElementById('category_modal_section2').style.display = "none"
    document.getElementsByClassName('category_modal_section')[2].classList.remove('border');
}

function extendsUserList() {
    document.getElementsByClassName('category-modal-content')[0].classList.add('show')
    document.getElementsByClassName('category_modal_section')[0].classList.add('div')
    document.getElementById('category_modal_section2').style.display = "block"
    document.getElementsByClassName('category_modal_section')[2].classList.add('border');
    userSearch();
}

function submitCategory(type, categoryId) {
    let shareCheck = document.getElementById('category_share_q');
    let title = document.getElementById('category_title').value;
    let tagList = document.getElementsByClassName("tagListDiv");
    let shareUser = document.getElementsByClassName('tooltip');
    let data = {
        _id: categoryId,
        name: title,
        shareCheck: shareCheck.checked,
        tagIds: [],
        shareMemberIds: [],
    }
    for (let i = 0; i < tagList.length; i++) {
        data.tagIds.push(tagList[i].id);
    }
    if (shareCheck.checked) {
        for (let i = 0; i < shareUser.length; i++) {
            data.shareMemberIds.push(shareUser[i].id);
        }
    }
    const url = '/category';

    $.ajax({
        type: type,
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            alert(res.message);
            location.reload();
        },
        error: function (err) {
            return alert(err.responseJSON.message);
        }
    })
}