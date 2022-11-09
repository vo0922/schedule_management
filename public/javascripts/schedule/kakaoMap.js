// 스케쥴 상세페이지에 사용될 카카오맵의 매커를 담을 배열
let markers = [];

/**
 * 담당자 : 박신욱
 * 함수 설명 : 처음으로 랜더링될 지도의 기본값 설정 함수
 * 주요 기능 : 지도의 중심 좌표를 서울로두고 확대 레벨을 3으로 설정
 */
let mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3
    };

// 지도를 생성
let map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성
let ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
let infowindow = new kakao.maps.InfoWindow({zIndex: 1});

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카카오맵에서 키워드로 검색했을경우 실행될 함수
 * 주요 기능 : 키워드가 정규식조건에 문제없이 실행될경우 키워드를통해 장소검색을 요청하는 기능
 */
function searchPlaces() {

    let keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청
    ps.keywordSearch(keyword, placesSearchCB);
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 장소검색이 완료되었을때 실행되는 콜백함수
 * 주요 기능 : 키워드로 검색된 검색목록을 호출하고 검색된 목록들을 페이징하는 기능
 */
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        // 검색 목록 표출
        displayPlaces(data);

        // 페이지 번호를 표출
        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
    }
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카카오맵에서 키워드로 검색 결과 목록을 호출하는 함수
 * 주요 기능 : 기존 검색결과 목록을 삭제하고 추가된 새롭개 검색된 결과를 목록으로 바인딩하는 기능
 * 각 검색목록 요소들을 클릭했을경우 실행될 이벤트를 정의
 */
function displayPlaces(places) {
    let listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds();

    // 검색 결과 목록에 추가된 항목들을 제거
    removeAllChildNods(listEl);
    
    removeMarker();

    for (let i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시
        let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가
        bounds.extend(placePosition);
        
        // 검색결과에 표출된 리스트요소를 클릭시 클릭한 요소의 좌표값을통해 마커표출
        (function (place, index) {

            itemEl.onclick = function () {
                var placePosition = new kakao.maps.LatLng(place.y, place.x);
                addMarker(placePosition, index);
                addressInput.value = place.place_name;
                address.value = place.address_name;
                addressLat.value = place.y;
                addressHard.value = place.x;
            }

            itemEl.onmouseout = function () {
                infowindow.close();
            };
        })(places[i], i);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 확대 및 축소
    map.setBounds(bounds);
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 키워드로 검색된 검색 항목들을 Element로생성해 리스트를 반환하는 함수
 * 주요 기능 : 검색된 항목들을 Element로 생성 후 리스트 반환
 */
function getListItem(index, places) {

    let el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
            '<div class="info">' +
            '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
            '   <span class="jibun gray">' + places.address_name + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>';

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카카오맵에 사용될 마커를 추가하고 바인딩하는 함수
 * 주요 기능 : 기존의 마커들을 삭제하고 추가될 마커들의 모양과 크기를 정의하고 위치값을통해 마커 바인딩
 * 마커의 위치 좌표값을통해 맵의 범위를 확대및 축소
 */
function addMarker(position, idx, title) {
    removeMarker()
    let bounds = new kakao.maps.LatLngBounds()
    bounds.extend(position);
    map.setBounds(bounds);
    let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(0, (0 * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
        });

    marker.setMap(map); // 지도 위에 마커를 표출
    markers.push(marker);  // 배열에 생성된 마커를 추가

    return marker;
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 카카오맵에 표출된 마커를 모두 삭제하는 함수
 * 주요 기능 : 기존에 저장된 마커의 배열을 초기화하고 표출된 마커모두 삭제
 */
function removeMarker() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 키워드로 검색된 검색 목록을 페이징하는 함수
 * 주요 기능 : 기존에 추가된 페이지번호들을 삭제하고 새롭게 검색된 목록들을 가져와 페이징 처리하는 기능
 */
function displayPagination(pagination) {
    let paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

    // 기존에 추가된 페이지번호를 삭제
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
        let el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function (i) {
                return function () {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 검색결과 목록의 Elment들을 삭제하는 함수
 * 주요 기능 : 검색결과 목록의 요소들이 존재하지 않을때 까지 삭제하는 기능
 */
function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}