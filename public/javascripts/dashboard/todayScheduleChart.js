window.onload = function () {
    scheduleCompletion()
}

// 오늘 일정 완료율
function scheduleCompletion() {
    $.ajax({
        type: 'get',
        url: '/todaySchedule',
        success: function (res) {
            // 총 일정 갯수
            let totalScheduleCount = res.data.length
            let doneScheduleCount = 0;
            addressListBind(res.data)
            res.data.map((data) => {
                if (data.map) {
                    let placePosition = new kakao.maps.LatLng(data.map.y, data.map.x);
                    dashBoardAddMarker(placePosition, 1, data.map.title);
                }
                // 완료한 일정 갯수 구하기
                if (data.completion) {
                    doneScheduleCount += 1
                }
            })
            scheduleBinding(res.data)
            let doneRate = 0
            if (!isNaN(doneScheduleCount / totalScheduleCount * 100))
                doneRate = doneScheduleCount / totalScheduleCount * 100
            let doneRatePoint = doneRate.toFixed(1)
            let dateString = ['일', '월', '화', '수', '목', '금', '토'];
            let todayString = `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}.${dateString[new Date().getDay()]}`
            document.getElementById('addressListCount').innerText = res.data.length;
            document.getElementById('scheduleCount').innerText = res.data.length;
            document.getElementById('radial-progress').setAttribute('data-percentage', doneRatePoint);
            document.getElementById('percentageText').innerHTML = doneRatePoint + '%';
            document.getElementById('todayDateTag').innerHTML = todayString;

            if (Object.keys(dashBoardBounds).length) {
                dashBoardMap.setBounds(dashBoardBounds);
            }
            $.radialChart()
        },
        error: function (err) {
            return alert(err.responseJSON.message);
        }
    })
}

$('svg.radial-progress').each(function () {
    $(this).find($('circle.complete')).removeAttr('style');
});
$.radialChart = function () {
    $('svg.radial-progress').each(function () {
        // 진행률 가져오기
        let percent = document.getElementById('radial-progress').getAttribute('data-percentage');
        // svg circle.complete의 반지름을 가져옵니다
        let radius = $(this).find($('circle.complete')).attr('r');
        // 원주 가져오기 (2πr)
        let circumference = 2 * Math.PI * radius;
        // 원주의 백분율을 기준으로 stroke-dashoffset 값을 가져옵니다.
        // Get stroke-dashoffset value based on the percentage of the circumference
        let strokeDashOffset = circumference - ((percent * circumference) / 100);
        // 1.25초 동안 transition 진행
        $(this).find($('circle.complete')).animate({'stroke-dashoffset': strokeDashOffset}, 800);
    })
}