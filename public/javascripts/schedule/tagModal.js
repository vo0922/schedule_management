let modal = document.getElementById('scheduleModal');

function tagKeyUp(e) {
    let tagHash = e.value.split('#');
    if (window.event.keyCode == 13) {
        let tagList = document.getElementById('tagList').value;
        if (!tagList)
            return
        if (!tagHash[0])
            return addTagList(tagHash[1])
        addTagList(tagList);
    }
}

function tagInput(e) {
    let tagHash = e.value.split('#');
    if (!e.value)
        return modal.style.display = "none";
    if (!tagHash[0])
        return select(tagHash[1]);
    select(e.value)
}

function select(text) {
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
                return modal.style.display = "none";
            else {
                modal.style.display = "block";
            }

            res.data.map((data) => {
                tagDiv += `<p onclick="addTagList(this.innerText)">${data.name}</p>`
            })
            tagList.innerHTML = tagDiv
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function addTagList(text) {
    let newTag = createElements(text);
    let leftTag = document.getElementsByClassName(text)[0];
    if (leftTag) {
        return alert("이미 태그가 존재합니다.");
    }
    let tagDiv = document.getElementById('tagList');
    tagDiv.before(newTag);
    tagDiv.value = '';
    modal.style.display = "none";
}

function createElements(text) {
    let newTag = document.createElement('div')
    newTag.innerText = text;
    newTag.className = `tagList ${text}`;
    let newDelete = document.createElement('i');
    newDelete.className = 'fa-regular fa-circle-xmark';
    newDelete.onclick = function () {
        newTag.remove();
    }
    newTag.appendChild(newDelete);
    return newTag;
}