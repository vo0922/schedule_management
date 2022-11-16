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

/**
 * 담당자 : 이승현
 * 함수 설명 : 캘린더 페이지 사이드바를 접었다, 폈다 토글하는 함수
 * 기능 설명 : 카테고리 영역과 카테고리 탭 영역을 동적으로 접었다, 폈다 할 수 있는 기능입니다.
 */
function sidebarToggle() {
    const sidebar = document.getElementById("mySidebar")
    const classes = sidebar.classList
    
    const result = classes.toggle("close")
    
  // [<<]일 때
  if(result === true){
    document.getElementById("mySidebar").style.width = "0px";
    document.getElementById("calendar_section2").style.margin = "0px auto";
    document.getElementById("sidebar_toggle_btn").style.left = "0px";
    document.getElementById("openbtn_i").style.transform = "rotate(0deg)"
    // [>>]일 때
  }else {
    document.getElementById("mySidebar").style.width = "27.7%";
    document.getElementById("calendar_section2").style.margin = "0px auto";
    document.getElementById("sidebar_toggle_btn").style.left = "23.2%";
    document.getElementById("openbtn_i").style.transform = "rotate(180deg)"
  }
}
