// map-logic.js

const map = L.map('map', {
    crs: L.CRS.Simple,
    zoomSnap: 0,
    maxZoom: 3
});

// 웹에 띄운 이미지의 실제 픽셀 크기 (압축 후에도 7300x7300을 유지했다면 7300)
// 만약 4560으로 크기를 줄여서 압축했다면 이 숫자를 4560으로 바꿔주세요.
const webImgSize = 7300; 

// 픽셀 좌표를 측정한 원본 이미지의 크기
const originalImgWidth = 7300;  
const originalImgHeight = 7300; 

const imageBounds = [[0, 0], [webImgSize, webImgSize]];
L.imageOverlay('hanwol-map.jpg', imageBounds).addTo(map);

function fitMapToScreen() {
    map.setMinZoom(-10);
    map.fitBounds(imageBounds);
    map.setMinZoom(map.getZoom());
}
fitMapToScreen();
map.setMaxBounds(imageBounds);
window.addEventListener('resize', () => fitMapToScreen());


// --- [좌표 동기화 (영점 조절) 로직] ---

// 1. 측정하신 대각선 두 지점 (2번 북서쪽과 4번 남동쪽 데이터 사용)
const refA = { mcX: -5321, mcZ: -5519, pxX: 1277, pxY: 1246 }; 
const refB = { mcX: 7265, mcZ: 5293, pxX: 6874, pxY: 6046 };   

// 2. 1블록당 픽셀 비율 및 오프셋 계산
const scaleX = (refB.pxX - refA.pxX) / (refB.mcX - refA.mcX);
const scaleZ = (refB.pxY - refA.pxY) / (refB.mcZ - refA.mcZ);
const offsetX = refA.pxX - (refA.mcX * scaleX);
const offsetZ = refA.pxY - (refA.mcZ * scaleZ);

// 3. 변환 함수 (마크 좌표 -> 웹 지도 좌표)
function mcToPx(mcX, mcZ) {
    const origPxX = (mcX * scaleX) + offsetX;
    const origPxY = (mcZ * scaleZ) + offsetZ;

    // 현재 화면에 띄운 웹 이미지 해상도에 맞게 스케일 조정
    const webPxX = origPxX * (webImgSize / originalImgWidth);
    const webPxY = origPxY * (webImgSize / originalImgHeight);

    // Leaflet 좌표계(위에서 아래로 내려오는 Y축 보정)로 변환
    return [(webImgSize - webPxY), webPxX];
}
