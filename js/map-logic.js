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
L.imageOverlay('images/map.jpg', imageBounds).addTo(map);

function fitMapToScreen() {
    map.setMinZoom(-10);
    map.fitBounds(imageBounds);
    map.setMinZoom(map.getZoom());
}
fitMapToScreen();
map.setMaxBounds(imageBounds);
window.addEventListener('resize', () => fitMapToScreen());


// --- [좌표 동기화 (영점 조절) 로직] ---

// X축(동서) 배율: (6381 - 288) / (6123 - (-7547)) ≒ 0.44573
// Z축(남북) 배율: (6552 - 765) / (6378 - (-6601)) ≒ 0.44587
const scaleX = 0.445733; 
const scaleZ = 0.445873; 

// 2. 4지점의 중간값을 역산하여 도출한 정밀 영점(Offset)
const offsetX = 3652.23;
const offsetZ = 3708.21;

// 3. 변환 함수 (기존 로직 유지)
function mcToPx(mcX, mcZ) {
    // 원본 픽셀 좌표 계산
    const origPxX = (mcX * scaleX) + offsetX;
    const origPxY = (mcZ * scaleZ) + offsetZ;
    
    // 웹 이미지 크기 비율 적용 (현재 7300/7300이라 1:1)
    const webPxX = origPxX * (webImgSize / originalImgWidth);
    const webPxY = origPxY * (webImgSize / originalImgHeight);
    
    // Leaflet Simple CRS의 Y축 반전 대응 [Y, X]
    return [(webImgSize - webPxY), webPxX];
}
