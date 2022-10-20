window.addEventListener('load', function () {
    const url = '/category'
    let myCategoryList = document.getElementById('myCategoryList');
    $.ajax({
        type: 'get',
        url: url,
        success: function (res) {
            let categoryList = [];
            res.data.map((data) => {
                categoryList.push(`<div class="categoryList" id="${data._id}">
                                    <p>${data.name}</p>
                                    <div class="categoryIcon"><i onclick='categoryEditModalOpen(${JSON.stringify(data._id)})' class="fa-regular fa-pen-to-square"></i>
                                    <i class="fa-regular fa-trash-can"></i></div>
                                    </div>`)
            })
            myCategoryList.innerHTML = categoryList.join('');
        },
        error: function (err) {
            console.log(err);
        }
    })
})