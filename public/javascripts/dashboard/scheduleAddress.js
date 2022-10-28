window.onload = () => {
    var placePosition = new kakao.maps.LatLng("35.85430901539491", "128.548124584983");
    var placePosition1 = new kakao.maps.LatLng("35.8156951676415", "128.52424740416");
    addMarker(placePosition, 1, '감삼역');
    addMarker(placePosition1, 2, '두류역');
    map.setBounds(bounds);
}