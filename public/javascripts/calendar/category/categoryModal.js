/*=============== 공유 옵션 checkbox 클릭 시 정보 표시 ===============*/
function share_user() {
    let cb = document.getElementById('category_share_q').checked
    let shareList = document.getElementById('checkShareUser_list')
    if (cb) {
        shareList.style.display = "block"
    } else {
        shareList.style.display = "none"
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
    shareList.style.display = "none"
    categoryTagModal.style.display = "none";
}

function submitCategory() {
    let shareCheck = document.getElementById('category_share_q');
    let title = document.getElementById('category_title').value;
    let tagList = document.getElementsByClassName("tagListDiv");
    let shareUser = document.getElementsByClassName('tooltip');
    let data = {
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
        type: 'post',
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