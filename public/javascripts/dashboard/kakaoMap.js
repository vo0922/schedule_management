// 대쉬보드에 사용될 카카오맵의 마커를 담을 배열
let dashBoardMarkers = [];

/**
 * 담당자 : 박신욱
 * 함수 설명 : 처음으로 랜더링될 지도의 기본값 설정 함수 입니다.
 * 주요 기능 : 지도의 중심 좌표를 서울로두고 확대 레벨을 3으로 설정합니다.
 */
let dashBoardMapContainer = document.getElementById('dashBoardMap'), // 지도를 표시할 div
    dashBoardMapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3
    };

// 마커에 표시될 오버레이를 담을 변수입니다.
var overlay = [];

// 지도를 생성합니다
let dashBoardMap = new kakao.maps.Map(dashBoardMapContainer, dashBoardMapOption);
let dashBoardBounds = new kakao.maps.LatLngBounds();
function dashBoardAddMarker(position, idx, title) {
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
        });
    var content = '<div class="customoverlay">' +
        `  <a href="https://map.kakao.com/link/map/${title},${position.Ma},${position.La}" target="_blank">` +
        `    <span class="title">${title}</span>` +
        '  </a>' +
        '</div>';

    var customOverlay = new kakao.maps.CustomOverlay({
        map: dashBoardMap,
        position: position,
        content: content,
        yAnchor: 1
    });

    overlay.push(customOverlay);

    dashBoardBounds.extend(position);
    marker.setMap(dashBoardMap); // 지도 위에 마커를 표출합니다
    dashBoardMarkers.push(marker);  // 배열에 생성된 마커를 추가합니다
    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function dashBoardRemoveMarker() {
    for (let i = 0; i < dashBoardMarkers.length; i++) {
        dashBoardMarkers[i].setMap(null);
    }
    overlay.map((data) => {
        data.setMap(null);
    })
    dashBoardMarkers = [];
}
