
function categoryDelete(categoryId, name) {
    if(!confirm(`${name} 카테고리를 삭제 하시겠습니까?`)){
        return
    }
    const url = '/category'
    $.ajax({
        type: 'delete',
        contentType: 'application/json',
        url: url,
        data: JSON.stringify({categoryId: categoryId}),
        success: function (res) {
            alert(res.message);
            location.reload()
        },
        error: function (err) {
            console.log(err);
        }
    })
}