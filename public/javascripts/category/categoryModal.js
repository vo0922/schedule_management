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
