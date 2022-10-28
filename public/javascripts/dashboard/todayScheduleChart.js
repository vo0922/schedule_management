window.onload = function() {
  scheduleCompletion()
}
// 오늘 일정 완료율
function scheduleCompletion(data) {
  $.ajax({
      type: 'get',
      url: '/todaySchedule',
      // contentType: 'application/json',
      data: data,
      success: function (res) {
        // 총 일정 갯수
        let totalScheduleCount = res.data.length
        document.getElementById('scheduleCount').innerHTML = totalScheduleCount
        res.data.map((data) => {
          console.log(data.completion)
          // 완료한 일정 갯수 구하기
          let doneSchedule = []
          let doneScheduleCount = doneSchedule.length
          console.log(doneScheduleCount)
          if(data.completion === true){
            doneScheduleCount += 1
            console.log(doneScheduleCount)
            // 확률 구하기
            let doneRate = doneScheduleCount / totalScheduleCount * 100
            console.log(doneRate)
            let doneRatePoint = doneRate.toFixed(1)
            console.log(doneRatePoint)
            document.getElementById('doneRatePoint').innerHTML = `<svg class="radial-progress" data-percentage="${doneRatePoint}" viewBox="0 0 80 80">`
          }
        })
          // let scheduleCompletionData = [];
          // let scheduleCompletionCount = 0;
          // if(res.data.length > 1) {
          //     res.data.map((data) => {
          //         scheduleCompletionCount += data.scheduleId.length;
          //         data.scheduleId.map((schedules) => {
          //             scheduleCompletionData.push(schedules);
          //         })
          //     })
          // } else {
          //     scheduleCompletionCount = res.data.scheduleId.length;
          //     scheduleCompletionData = res.data.scheduleId;
          // }
          // document.getElementById('scheduleCompletionCount').innerText = scheduleCompletionCount;
          // tagAboutScheduleBind(scheduleCompletionData)
      },
      error: function (err) {
          console.log(err)
      }
  })
}
  // 인라인 스타일을 제거하는 js
  $('svg.radial-progress').each(function( index, value ) { 
    $(this).find($('circle.complete')).removeAttr( 'style' );
  });
  $(window).scroll(function(){
    $('svg.radial-progress').each(function( index, value ) { 
      // 위에서 아래로 스크롤할 때 svg.radial-progress가 윈도우에 수직으로 약 25%인 경우
      if ( 
          $(window).scrollTop() > $(this).offset().top - ($(window).height() * 0.75) &&
          $(window).scrollTop() < $(this).offset().top + $(this).height() - ($(window).height() * 0.25)
      ) {
          // 진행률 가져오기
          percent = $(value).data('percentage');
          // svg circle.complete의 반지름을 가져옵니다
          radius = $(this).find($('circle.complete')).attr('r');
          // 원주 가져오기 (2πr)
          circumference = 2 * Math.PI * radius;
          // 원주의 백분율을 기준으로 stroke-dashoffset 값을 가져옵니다.
          // Get stroke-dashoffset value based on the percentage of the circumference
          strokeDashOffset = circumference - ((percent * circumference) / 100);
          // 1.25초 동안 transition 진행
          $(this).find($('circle.complete')).animate({'stroke-dashoffset': strokeDashOffset}, 1250);
      }
    });
  }).trigger('scroll');
