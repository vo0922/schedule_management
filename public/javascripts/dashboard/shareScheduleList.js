window.addEventListener('load', function () {
    shareScheduleBind(null)
});

function filterMenu() {
    let menu = document.querySelector('.filterMenu');
    menu.classList.toggle('active')
}

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
                  <div class="shareScheduleList_content" onmouseover="shareScheduleListDivHover(this)" onmouseout="shareScheduleListDivNotHover(this)">
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
            console.log(err)
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