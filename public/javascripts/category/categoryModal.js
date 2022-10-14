/*=============== 공유 옵션 checkbox 클릭 시 정보 표시 ===============*/
function share_user() {
    let cb = document.getElementById('category_address_q').checked
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
                tagDiv += `<div class='tagDiv' onclick="addCategoryTagList('${data.name}')"><p>#</p><p>${data.name}</p></div>`
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


function addCategoryTagList(text) {
    let tagInput = document.getElementById('categoryTagInput')
    let newTag = createElements(text);
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
    document.getElementById('category_address_q').checked = false;
    shareList.style.display = "none"
}
