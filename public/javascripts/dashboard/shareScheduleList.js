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
                  <div class="shareScheduleList_content">
                    <!-- 공유받은 일정 지정 색깔 -->
                    <div class="share_colorBox"></div>
                    <div class="share_contentBox">
                      <!-- 상단 영역 -->
                      <div class="shareScheduleList_content_top">
                        <div>
                          <!-- 공유받은 일정 제목 -->
                          <p class="shareScheduleList_content_top_title">${data.scheduleData.title}</p>
                          <!-- 진행도 표시 -->
                          <p class="shareScheduleList_content_top_progress">${data.scheduleData.completion}</p>
                        </div>
                        <!-- 날짜 -->
                        <p>
                            ${new Date(data.scheduleData.startDate).getFullYear()}.${new Date(data.scheduleData.startDate).getMonth() + 1}.${new Date(data.scheduleData.startDate).getDate()}
                            ~
                            ${new Date(data.scheduleData.endDate).getFullYear()}.${new Date(data.scheduleData.endDate).getMonth() + 1}.${new Date(data.scheduleData.endDate).getDate()}
                        </p>
                      </div>
                      <!-- hover 시 보이는 하단 영역 -->
                      <div class="shareScheduleList_content_bottom">
                        <!-- 공유자 프로필(사진, 이름, 메일) -->
                        <img class="share_user_img" src="/images/kakao_icon.png" alt="profile_img">
                        <div class="share_user_profile">
                          <p>${data.category.memberId.name}</p>
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