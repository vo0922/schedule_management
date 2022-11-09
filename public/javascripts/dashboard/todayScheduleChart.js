/**
 * 담당자 : 이승현
 * 함수 설명 : 페이지가 온로드 될 때 실행하는 함수
 */
window.onload = function () {
    // 오늘 일정 완료율
    scheduleCompletion()
}

/**
 * 담당자 : 이승현, 박신욱
 * 함수 설명 : 오늘 일정 완료율 계산 함수
 * 주요 기능 : ajax 통신으로 오늘 총 일정 갯수를 받아와서 완료한 일정 갯수를 구하고, 일정 완료율을 계산한 후 chart에 데이터를 뿌려줍니다.
 */
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
                    // 카카오맵을 첫 랜더링 값으로 초기화
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
            // 완료율이 nan값이 아닐경우 처리
            if (!isNaN(doneScheduleCount / totalScheduleCount * 100))
                doneRate = doneScheduleCount / totalScheduleCount * 100
            // .toFixed(1)로 소수점 1자리까지 구하기
            let doneRatePoint = doneRate.toFixed(1)
            let dateString = ['일', '월', '화', '수', '목', '금', '토'];
            let todayString = `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}.${dateString[new Date().getDay()]}`
            // 전체 일정 갯수
            document.getElementById('scheduleCount').innerText = res.data.length;
            // 차트에 일정 완료율 데이터 넘겨주기
            document.getElementById('radial-progress').setAttribute('data-percentage', doneRatePoint);
            // 일정 완료율 표시
            document.getElementById('percentageText').innerHTML = doneRatePoint + '%';
            // 오늘 날짜
            document.getElementById('todayDateTag').innerHTML = todayString;

            // 카카오 맵 범위를 확대 및 축소
            if (Object.keys(dashBoardBounds).length) {
                dashBoardMap.setBounds(dashBoardBounds);
            }
            $.radialChart()
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}

/**
 * 담당자 : 이승현
 * 함수 설명 : 일정 완료율 차트 표시 함수
 * 주요 기능 : 계산된 일정 완료율을 차트에 반영하여 표시합니다.
 */
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
        let strokeDashOffset = circumference - ((percent * circumference) / 100);
        // 1.25초 동안 transition 진행
        $(this).find($('circle.complete')).animate({'stroke-dashoffset': strokeDashOffset}, 800);
    })
}