/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드 페이지가 랜더링될때 공유일정 데이터를 바인딩하는 함수 호출하는 함수
 */
window.addEventListener('load', function () {
    shareScheduleBind(null)
});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 당일 공유된 일정 필터에서 필터이외의 요소들을 클릭시 필터팝업창 닫는 함수
 * 주요 기능 : this객체를 인자로받아 공유 필터요소 자식 요소에 this객체가 존재하지 않다면 필터 팝업창 닫기
 */
window.addEventListener('click', function (e) {
    let shareScheduleFilter = document.querySelector('.shareScheduleHeaderRight');
    let menu = document.querySelector('.filterMenu');

    if(!shareScheduleFilter.getElementsByClassName(e.target.className).length) {
        menu.classList.remove('active')
    }
})

/**
 * 담당자 : 박신욱
 * 함수 설명 : 공유필터 팝업창을 끄고닫을 수 있는 팝업 toggle 함수
 */
function filterMenu() {
    let menu = document.querySelector('.filterMenu');
    menu.classList.toggle('active')
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 공유필터 팝업창에서 선택한 필터 종류에 따른 데이터 바인딩 함수 호출 하는 함수
 * 주요 기능 : progress를 인자로 진행중인 일정, 완료된 일정, 전체일정을 구분하여 공유 일정 바인딩 함수 호출
 */
function filterReq(progress) {
    let menu = document.querySelector('.filterMenu');
    menu.classList.toggle('active')
    shareScheduleBind(progress)
}

function shareScheduleBind(progress) {
    $.ajax({
        type: 'post',
        url: '/todayShareSchedule',
        contentType: 'application/json',
        data: JSON.stringify({progress: progress}),
        success: function (res) {
            let shareScheduleData = [];
            document.getElementById('shareScheduleCount').innerText = res.data.length
            res.data.map((data)=>{
                shareScheduleData.push(`
                  <div class="shareScheduleList_content" onmouseover="shareScheduleListDivHover(this)" onmouseout="shareScheduleListDivNotHover(this)" onclick="scheduleViewModalOpen('${data.scheduleData._id}', true)">
                    <!-- 공유받은 일정 지정 색깔 -->
                    <div class="share_colorBox" style="background-color:${data.category.color}"></div>
                    <div class="share_contentBox">
                      <!-- 상단 영역 -->
                      <div class="shareScheduleList_content_top">
                        <div>
                          <!-- 공유받은 일정 제목 -->
                          <p class="shareScheduleList_content_top_title">${data.scheduleData.title}</p>
                          <!-- 날짜 -->
                          <p>
                              ${new Date(data.scheduleData.startDate).getFullYear()}.${new Date(data.scheduleData.startDate).getMonth() + 1}.${new Date(data.scheduleData.startDate).getDate()}
                              ~
                              ${new Date(data.scheduleData.endDate).getFullYear()}.${new Date(data.scheduleData.endDate).getMonth() + 1}.${new Date(data.scheduleData.endDate).getDate()}
                          </p>
                          </div>
                          <!-- 진행도 표시 -->
                          <label class="shareScheduleCheckBox">
                            <input id="${data.scheduleData._id}check" type="checkbox" ${data.scheduleData.completion ? "checked" : null } disabled>
                            <div class="shareScheduleCheckBox_checkmark"></div>
                          </label>
                      </div>
                      <!-- hover 시 보이는 하단 영역 -->
                      <div class="shareScheduleList_content_bottom">
                        <!-- 공유자 프로필(사진, 이름, 메일) -->
                        <img class="share_user_img" src="${data.category.memberId.profile}" alt="profile_img">
                        <div class="share_user_profile">
                          <p class="share_user_name">${data.category.memberId.name}</p>
                          <p>${data.category.memberId.email}</p>
                        </div>
                        <!-- 공유받은 카테고리 이름 -->
                        <p class="share_category">${data.category.name}</p>
                      </div>
                    </div>
                  </div>
                `)
            })
            document.getElementById('shareScheduleList_div').innerHTML = shareScheduleData.join('')
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

// 공유 일정 목록 hover event
function shareScheduleListDivHover(e) {
  // console.log(e)
  let event = e.querySelector('.shareScheduleList_content_bottom')
  if (event) {
          event.classList.add('hover');
          e.style.height = "15vh"
      }
}

function shareScheduleListDivNotHover(e) {
  let event = e.querySelector('.shareScheduleList_content_bottom')
  if (event) {
          event.classList.remove('hover');
          e.style.height = "7vh"
  }
}