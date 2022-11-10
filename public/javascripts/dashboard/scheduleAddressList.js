/**
 * 담당자 : 박신욱
 * 함수 설명 : 대쉬보드의 유저의 당일 일정에 대한 장소를 바인딩하는 함수
 * 주요 기능 : 유저의 당일일정데이터를 인자로 받아 각 일정들마다 가야할 장소데이터를 바인딩하는 기능
 */
function addressListBind(addressData) {
    let addressEl = [];
    addressData.map((data) => {
        if(!data.map)
            return
        let content = data.content;
        // 일정의 내용이 20글자가 넘을경우 20글자까지만 표시하고 ...으로 표시
        if(content.length>20){
            content = content.substring(0, 20)
            content+='...';
        }
        addressEl.push(
            `
             <div class="addressCard" onclick='addressCardClick(${JSON.stringify(data)})'>
                <div class="addressCardHeader">
                    <div class="cardInfo">
                        <p class="cardAddress">${data.map.title}</p>
                        <p class="cardTitle">${data.title.length > 10 ? data.title.substr(0, 10) + '...' : data.title}</p>
                    </div>
                    <p class="cardDate">-${new Date(data.endDate).getFullYear()}.${new Date(data.endDate).getMonth() + 1}.${new Date(data.endDate).getDate()}</p>
                </div>
            <div class="addressCardContent">
                <p>${content}</p>
            </div>
            </div>
            `
        )
    });
    document.getElementById('addressListCount').innerText = addressEl.length.toString();
    document.getElementById('addressCardList').innerHTML = addressEl.join('');
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 당일 장소 리스트에서 장소Element를 클릭했을 경우 클릭한 장소를 대쉬보드 카카오맵에 바인딩하는 함수
 * 주요 기능 : 카카오맵에서 기존의 모든 마커와 모든 오버레이를 삭제함
 * 선택된 장소 위치 좌표값을 가져와 마커와 오버레이가 바인딩될 position값을 정의함
 * 정의된 position을 기준으로 카카오맵의 마커와 오버레이를 추가하고 해당 마커위치로 카카오맵화면을 확대한다.
 */
function addressCardClick(scheduleData) {
    dashBoardRemoveMarker();
    let placePosition = new kakao.maps.LatLng(scheduleData.map.y, scheduleData.map.x);
    let bound = new kakao.maps.LatLngBounds();
    bound.extend(placePosition);
    dashBoardMap.setBounds(bound);
    dashBoardAddMarker(placePosition, 1, scheduleData.map.title);
}

/**
 * 담당자 : 박신욱
 * 함수 설명 : 유저의 전체 당일 장소 데이터를 가져와 장소들에대해 카카오맵에 바인딩하는 함수
 * 주요 기능 : 기존의 존재하는 마커와 오버레이를 모두삭제하고 response로 받은 모든 장소들에 대해 대쉬보드 카카오맵에 마커와 오버레이 맵확대값을 전부 지정하는 기능
 */
function fullAdress() {
    $.ajax({
        type: 'get',
        url: '/todaySchedule',
        success: function (res) {
            dashBoardRemoveMarker();
            res.data.map((data) => {
                if(data.map) {
                    let placePosition = new kakao.maps.LatLng(data.map.y, data.map.x);
                    dashBoardAddMarker(placePosition, 1, data.map.title);
                }
            })
            // 여러게의 마커를 한눈에 볼수있도록 카카오맵 뷰화면을 확대및 축소
            if(Object.keys(dashBoardBounds).length){
                dashBoardMap.setBounds(dashBoardBounds);
            }
        },
        error: function (err) {
            console.log(err);
            return alert(err.responseJSON.message);
        }
    })
}