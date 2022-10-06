let modal = document.getElementById('scheduleModal');

function tagSelected(e) {
    select(e.value)
}

function select(text) {
    let tagList = document.getElementById('tagList');
    const url = '/tag/change'
    $.ajax({
        type: 'post',
        url : url,
        data : {
            text:text
        },
        success: function (res){
            let tagDiv = '';
            if(!res.data)
                return modal.style.display = "none";
            modal.style.display = "block";

            res.data.map((data)=>{
                tagDiv += `<p onclick="addTagList(this)">${data.name}</p>`
            })
            tagList.innerHTML = tagDiv
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function addTagList(e) {
    let tagList = document.getElementsByClassName('tagList');
    let newTag = document.createElement('div')
    newTag.innerText = e.innerText;
    newTag.className = 'tagList';
    tagList.append(newTag);
    let tagDiv = document.getElementById('tagList');
    tagDiv.append(tagDiv);
}