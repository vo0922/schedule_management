/**
 * 담당자 : 이승현
 * 함수 설명 : + 버튼 클릭 시 선택 사항 표시 함수
 */
let plus = document.getElementById("plus_menu")

function plus_menu() {
    if (plus.style.display === "none") {
        plus.style.display = "block"
    } else {
        plus.style.display = "none"
    }
}