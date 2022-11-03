function addressListBind(addressData) {
    let addressEl = [];
    addressData.map((data) => {
        addressEl.push(
            `
             <div class="addressCard" onclick='addressCardClick(${JSON.stringify(data)})'>
                <div class="addressCardHeader">
                   <p class="cardAddress">${data.map.title}</p>
                    <p class="cardTitle">${data.title}</p>
                    <p class="cardDate">-${new Date(data.endDate).getFullYear()}.${new Date(data.endDate).getMonth() + 1}.${new Date(data.endDate).getDay()}</p>
                </div>
            <div class="addressCardContent">
                <p>${data.content}</p>
            </div>
            </div>
            `
        )
    });
    document.getElementById('addressCardList').innerHTML = addressEl.join('');
}

function addressCardClick(scheduleData) {
    dashBoardRemoveMarker();
    let placePosition = new kakao.maps.LatLng(scheduleData.map.y, scheduleData.map.x);
    let bound = new kakao.maps.LatLngBounds();
    bound.extend(placePosition);
    dashBoardMap.setBounds(bound);
    dashBoardAddMarker(placePosition, 1, scheduleData.map.title);
}

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
            document.getElementById('addressListCount').innerText = res.data.length
            if(Object.keys(dashBoardBounds).length){
                dashBoardMap.setBounds(dashBoardBounds);
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}