let tagModal = document.getElementById('tagModal');

function tagKeyUp(e) {
    let tagListDiv = document.getElementsByClassName('tagListDiv')
    let tagHash = e.value.replace('#', '');
    if (window.event.keyCode == 13) {
        if (!e.value)
            return
        addTagList(tagHash);
    }
    if (!e.value && window.event.keyCode == 8 && tagListDiv.length)
        return tagListDiv[tagListDiv.length - 1].remove();
}

function tagInput(e) {
    let tagHash = e.value.replace('#', '');
    if (!e.value)
        return tagModal.style.display = "none";
    selectTag(tagHash)
}

function selectTag(text) {
    let tagList = document.getElementById('tagModalList');
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
                return tagModal.style.display = "none";
            else {
                tagModal.style.display = "block";
            }

            res.data.map((data) => {
                tagDiv += `<div class='tagDiv' onclick="addTagList('${data.name}')"><p>#</p><p>${data.name}</p></div>`
            })
            tagList.innerHTML = tagDiv
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function addTagList(text) {
    let tagInput = document.getElementById('tagInput')
    let newTag = createElements(text);
    let leftTag = document.getElementsByClassName(text)[0];
    if (leftTag) {
        tagModal.style.display = "none";
        return alert("이미 태그가 존재합니다.");
    }
    let tagDiv = document.getElementById('tagList');
    tagDiv.appendChild(newTag);
    tagInput.value = '';
    tagModal.style.display = "none";
}

function createElements(text) {
    let newTag = document.createElement('div');
    let tagName = document.createElement('p');
    let tagHash = document.createElement('p');
    newTag.className = 'tagListDiv';
    tagHash.innerText = '#';
    tagName.className = `tagList ${text}`;
    tagName.innerText = text;
    let newDelete = document.createElement('i');
    newDelete.className = 'fa-regular fa-circle-xmark';
    newDelete.onclick = function () {
        newTag.remove();
    }
    newTag.appendChild(tagHash);
    newTag.appendChild(tagName);
    newTag.appendChild(newDelete);
    return newTag;
}