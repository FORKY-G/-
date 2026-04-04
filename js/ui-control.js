//스폰 아이콘 설정
const spawnIcon = L.icon({
    iconUrl: 'images/compass.png', 
    iconSize: [24, 24],     // 크기를 48에서 24로 절반 축소
    iconAnchor: [12, 12],   // 아이콘 중앙 정렬 (24의 절반인 12)
    popupAnchor: [0, -10]   // 말풍선 위치도 아이콘 위로 살짝 내림
});

const spawnCoords = mcToPx(spawnData.mcX, spawnData.mcZ);

L.marker(spawnCoords, { icon: spawnIcon })
    .addTo(map)
    .bindPopup(`스폰 지점<br>[ ${spawnData.mcX}, ${spawnData.mcZ} ]`);
