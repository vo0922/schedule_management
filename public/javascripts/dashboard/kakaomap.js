// 마커를 담을 배열입니다
let dashBoardMarkers = [];

let dashBoardMapContainer = document.getElementById('dashBoardMap'), // 지도를 표시할 div
    dashBoardMapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

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
