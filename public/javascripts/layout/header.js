let clickUser = document.getElementById("drop-user-content")
let clickColor = document.getElementById("drop-color-content")

/**
 * 담당자 : 박신욱
 * 함수 설명 : 색 모달창과 유저 프로필 모달창이외의 요소클릭시 모달창 닫기 함수
 */
window.addEventListener('click', function (e){
    let userProfileModal = document.querySelector('.userProfile');
    let headerColorModal = document.querySelector('.headerColor');
    let colorChangeModal = document.querySelector('.color_change');
    const up = document.querySelector('.fa-caret-down')
    if(!userProfileModal.getElementsByClassName(e.target.className).length) {
        clickUser.style.display = "none"
        up.style.transform = "rotateX( 0deg )"
    }
    if(!(headerColorModal.getElementsByClassName(e.target.className).length || colorChangeModal.getElementsByClassName(e.target.className).length)){
        clickColor.style.display = "none"
    }
})

/**
 * 담당자 : 이승현
 * 함수 설명 : User Profile 클릭 시 상세 정보가 보이는 합수
 */
function dp_userProfile() {
    const up = document.querySelector('.fa-caret-down')
    if (clickUser.style.display === "none") {
        clickUser.style.display = "block"
        clickColor.style.display = "none"
        up.style.transform = "rotateX( 180deg )"
    } else {
        clickUser.style.display = "none"
        up.style.transform = "rotateX( 0deg )"
    }
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 팔레트 클릭 시 header 색상 바꾸기 상세 정보가 보이는 함수
 */
function dp_headerColor() {
    if (clickColor.style.display === "none") {
        clickColor.style.display = "block"
        clickUser.style.display = "none"
        init();
    } else {
        clickColor.style.display = "none"
    }
}


/**
 * 담당자 : 이승현
 * 함수 설명 : 사용자 지정 상단 메뉴 색상 변경 함수
 * 주요 기능 : 색상 코드를 지정해서 팔레트를 만들어 주고, 선택한 색상으로 상단 메뉴 색상이 변경된다.
 */
let selectedColor; // 선택한 컬러값 저장할 변수
function init() {
    let colorChip = ["#fff", "#dcd0c3", "#b4afaa",
        "#ccdeeb", "#c9d3e7", "#92b5d8",
        "#cdd9c8", "#b7beae", "#fbf199",
        "#ffccbb", "#e7b3a7", "#ea999b",
        "#c191a3", "#c9b5c8", "#a690a9"]; //색상코드
    let colorChange = "";
    let leftColor = document.getElementById('leftColor').value;
    for (let i = 0; i < colorChip.length; i++) {  //colorBox 의 id명을 색상명으로 지정해주기.
        if (leftColor == colorChip[i]) {
            selectedColor = colorChip[i]
            // 선택한 컬러값에 선택됨을 표시해 주는 selected class를 추가
            colorChange += "<div id=" + colorChip[i] + " class='colorBox selected' onclick='colorSet(this)'></div>";
        }
        else
            colorChange += "<div id=" + colorChip[i] + " class='colorBox' onclick='colorSet(this)'></div>";
    }
    document.getElementById("colorList").innerHTML = colorChange;

    let colorBoxList = document.getElementsByClassName("colorBox");
    for (let i = 0; i < colorBoxList.length; i++) {
        colorBoxList[i].style.background = colorBoxList[i].id;  //id인 색상명을 colorBox의 배경색으로 지정해주기
    }
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 사용자 지정으로 바뀐 배경 색상을 유저스키마에 업데이트하는 요청을 보내는 함수
 * 주요 기능 : ajax 통신으로 배경색을 선택한 색상박스의 id값으로 지정해서 database에 update한다. 
 */
function colorSet(colorPick) {
    const url = `/colorUpdate`
    $.ajax({
        type: 'post',
        url: url,
        data: {
            color: colorPick.id
        },
        success: function (res) {
            //배경색을 선택한 색상박스의 id 값으로 지정해주기
            document.querySelector("#header").style.background = res.data;  

        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
    // 선택된 색상에 선택됨을 알리는 효과 또한 페이지를 나갔다가 다시 들어와도 보이도록
    if (selectedColor != null) {
        document.getElementById(selectedColor).className = document.getElementById(selectedColor).className.replace(" selected", "");
    }
    document.getElementById(colorPick.id).className += " selected";
    document.getElementById('leftColor').value = colorPick.id;
    selectedColor = colorPick.id;
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 스크롤이 발생했을 때 header에 그림자가 생기는 class를 추가해 준다
 */
function scrollHeader() {
    const header = document.getElementById('header')
    // 스크롤 높이가 80 veiwport 보다 크면 header 태그에 scroll-header class 를 추가한다.
    if (this.scrollY >= 80) {
        header.classList.add('scroll-header')
    } else {
        header.classList.remove('scroll-header')
    }
}

let stateUrl = document.querySelector('#stateUrl').value;

/**
 * 담당자 : 박신욱
 * 함수 설명 : 현제 url값에 따라 위치하고있는 메뉴가 어디인지 표시하기위한 함수
 * 주요 기능 : active-lick클래스를 추가하여 위치하고 있는 메뉴에 따로 css적용
 */
switch (stateUrl) {
    case 'home':
        document.querySelector('.home').classList.add('active-link');
        break;
    case 'calendar':
        document.querySelector('.calendar').classList.add('active-link');
        break;
    case 'statistics':
        document.querySelector('.statistics').classList.add('active-link');
        break;
    default:
        document.querySelector('.home').classList.add('active-link');
        break;
}

window.addEventListener('scroll', scrollHeader)

/**
 * 담당자 :  이승현
 * 함수 설명 : 모바일 반응형 네비게이션 만드는 함수
 * 주요 기능 : 웹 너비가 767px 이하일 때 반응하는 헤더 메뉴 조정입니다.
 */
/*=============== 반응형. SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navMenuLogin = document.getElementById('nav-menu-login'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW. 메뉴 보이기 =====*/
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
        navMenuLogin.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN. 메뉴 닫기 =====*/
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
        navMenuLogin.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE. 모바일에서 메뉴 toggle ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu'),
          navMenuLogin = document.getElementById('nav-menu-login')
          

    // 각 nav__link를 클릭하면 show-menu 클래스가 제거됨
    navMenu.classList.remove('show-menu')
    navMenuLogin.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))