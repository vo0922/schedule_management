window.addEventListener('load', function (){
    const url = '/category'
    let myCategoryList = document.getElementById('myCategoryList');
    $.ajax({
        type: 'get',
        url: url,
        success: function (res) {
            let categoryList = [];
            res.data.map((data)=>{
                categoryList.push(`<div id="${data._id}">${data.name}</div>`)
            })
            myCategoryList.innerHTML = categoryList.join('');
        },
        error: function (err) {
            console.log(err);
        }
    })
})