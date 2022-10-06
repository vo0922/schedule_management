let modal = document.getElementById('scheduleModal');

function tagSelected(e) {
    if (window.event.keyCode == 13) {
        let tagList = document.getElementById('tagList');
        addTagList(tagList.value);
        tagList.value='';
    } else {
        select(e.value)
    }
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
            modal.style.display = "block";

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
    let newTag = document.createElement('div')
    newTag.innerText = text;
    newTag.className = 'tagList';
    let tagDiv = document.getElementById('tagList');
    tagDiv.before(newTag);
    modal.style.display = "none";
}