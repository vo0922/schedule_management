let clickUser = document.getElementById("drop-user-content")
let clickColor = document.getElementById("drop-color-content")

/*=============== User Profile 클릭 시 상세 정보 표시 ===============*/
function dp_menu() {
    if (clickUser.style.display === "none") {
        clickUser.style.display = "block"
        clickColor.style.display = "none"

    } else {
        clickUser.style.display = "none"
    }
}
/*=============== 팔레트 클릭 시 header 색상 바꾸기 상세 정보 표시 ===============*/
function dp_headerColor() {
    if (clickColor.style.display === "none") {
        clickColor.style.display = "block"
        clickUser.style.display = "none"
    } else {
        clickColor.style.display = "none"
    }
}

let selectedColor; //선택한 컬러값 저장할 변수

window.onload = function(){
    init();
}

function init(){
    let colorChip = ["#ffffff", "#f7e600", "#7dbad5",
                    "#e091a9", "#86e6c2", "#81c147",
                    "#9941ec", "#ff93f1", "#fd3b85",
                    "#ffd54a", "#6eff4a", "#5ab9c5"]; //색상코드
    let tag = "";
    for(i=0; i<colorChip.length; i++){  //colorBox 의 id명을 색상명으로 지정해주기.
        tag += "<div id="+colorChip[i]+" class='colorBox' onclick='colorSet(this)'></div>";
    }
    document.getElementById("colorList").innerHTML = tag;

    let colorBoxList = document.getElementsByClassName("colorBox");
    for(i=0; i<colorBoxList.length; i++){
        colorBoxList[i].style.background = colorBoxList[i].id;  //id인 색상명을 colorBox의 배경색으로 지정해주기
    }
}

// onclick event
function colorSet(colorPick){
    const url = `/colorUpdate`
    $.ajax({
      type: 'post',
      url : url,
      data: {
        color: colorPick.id
      },
      success: function (res){
        document.querySelector("#header").style.background = res.data;  //배경색을 선택한 색상박스의 id 값으로 지정해주기

      },
      error: function (err) {
          console.log(err);
      }
  })
    if(selectedColor != null){
        document.getElementById(selectedColor).className = document.getElementById(selectedColor).className.replace(" selected", "");
    }
    document.getElementById(colorPick.id).className += " selected";
    selectedColor = colorPick.id;
}


/*=============== CHANGE BACKGROUND HEADER. header 배경 변경 ===============*/
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
