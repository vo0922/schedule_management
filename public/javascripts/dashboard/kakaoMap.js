// 대쉬보드에 사용될 카카오맵의 마커를 담을 배열
let dashBoardMarkers = [];

/**
 * 담당자 : 박신욱
 * 함수 설명 : 처음으로 랜더링될 지도의 기본값 설정 함수
 * 주요 기능 : 지도의 중심 좌표를 서울로두고 확대 레벨을 3으로 설정
 */
let dashBoardMapContainer = document.getElementById('dashBoardMap'), // 지도를 표시할 div
    dashBoardMapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3
    };

// 마커에 표시될 오버레이를 담을 변수
var overlay = [];

// 지도 생성
let dashBoardMap = new kakao.maps.Map(dashBoardMapContainer, dashBoardMapOption);
let dashBoardBounds = new kakao.maps.LatLngBounds();

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드 카카오맵에 사용될 마커 및 오버레이를 추가하고 바인딩하는 함수
 * 주요 기능 : 추가할 마커의 위치 좌표값과 title데이터를 인자로 받아 마커를 생성합니다.
 * 추가할 오버레이의 Element를 정의하고 오버레이 변수에 포함
 * 커스텀한 오버레이와 마커를 지도에 표시
 */
function dashBoardAddMarker(position, idx, title) {
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
        });
        // 커스텀한 오버레이 Element
        // href url을 통해 실제 카카오맵에 선택한 장소에 마커를 찍히도록 정의
    var content = '<div class="customoverlay">' +
        `  <a href="https://map.kakao.com/link/map/${title},${position.Ma},${position.La}" target="_blank">` +
        `    <span class="title">${title}</span>` +
        '  </a>' +
        '</div>';
    // 커스텀 오버레이를 카카오맵에 반영
    var customOverlay = new kakao.maps.CustomOverlay({
        map: dashBoardMap,
        position: position,
        content: content,
        yAnchor: 1
    });

    overlay.push(customOverlay);

    dashBoardBounds.extend(position);
    // 지도에 마커 표출
    marker.setMap(dashBoardMap);
    dashBoardMarkers.push(marker);
    return marker;
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드 카카오맵에 존재하는 모든 마커와 오버레이를 지우는 함수
 * 주요 기능 : 객체 배열로 담은 마커와 오버레이들을 카카오맵에서 null값으로 초기화
 */
function dashBoardRemoveMarker() {
    for (let i = 0; i < dashBoardMarkers.length; i++) {
        dashBoardMarkers[i].setMap(null);
    }
    overlay.map((data) => {
        data.setMap(null);
    })
    dashBoardMarkers = [];
    overlay = [];
}
