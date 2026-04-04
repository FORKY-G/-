const compassIcon = L.icon({
    iconUrl: 'images/compass.png',
    iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -10]
});

const transparentIcon = L.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 
    iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15]
});

// 1. 십이지신 동선 설정
const animalPathPoints = animals.map(ani => mcToPx(ani.mcX, ani.mcZ));
const polyline = L.polyline(animalPathPoints, {
    color: '#FFD700', weight: 2, opacity: 0, dashArray: '5, 8'
}).addTo(map);

// 2. 광산 전용 동선 설정 (색상별 4개)
const minePolylines = {};
const mineColors = { "녹": "#2ecc71", "청": "#3498db", "황": "#f1c40f", "적": "#e74c3c" };

Object.keys(minePaths).forEach(colorKey => {
    const pathCoords = minePaths[colorKey].map(num => {
        const m = mines.find(mine => mine.n === num);
        return mcToPx(m.x, m.z);
    });

    minePolylines[colorKey] = L.polyline(pathCoords, {
        color: mineColors[colorKey],
        weight: 3,
        opacity: 0,
        dashArray: '7, 10'
    }).addTo(map);
});

// 3. 좌표 복사 함수
window.copyCoords = (x, y, z) => {
    const text = `${x} ${y} ${z}`; 
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('copy-toast');
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 1500);
    });
};

// 4. 십이지신 마커 생성
// 4. 십이지신 마커 생성 (원래 디자인으로 복구)
animals.forEach((ani) => {
    const pos = mcToPx(ani.mcX, ani.mcZ);
    const marker = L.marker(pos, { icon: transparentIcon }).addTo(map);

   const popupContent = `
        <div style="text-align:center; min-width:240px; color:#000; padding: 0;">
            <div style="font-size:22px; font-weight:800; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:12px; word-break:keep-all;">
                ${mine.n}번 광산 <span style="font-size:14px; font-weight:800; color:#d00;">(${specificOres})</span>
            </div>
            
            <div style="background:#333; border-radius:4px; padding:6px 0; margin-bottom:12px; cursor:pointer;" 
                 onclick="copyCoords(${mine.x}, ${mine.y}, ${mine.z})">
                <div style="color:#FFD700; font-size:17px; font-weight:700; letter-spacing:0.5px; line-height:1.2;">
                    ${mine.x}, ${mine.y}, ${mine.z}
                </div>
                <div style="color:#aaa; font-size:11px; margin-top:2px;">(클릭하여 좌표 복사)</div>
            </div>

            <div style="font-size:13px; color:#333; line-height:1.5; letter-spacing:-0.3px; border-top:1px solid #aaa; padding-top:8px;">
                <div style="margin-bottom:6px; font-weight:600; color:#666;">[공통] ${commonOres}</div>
                <div style="font-weight:700; word-break:break-all;">
                    <span style="color:${mineColors[mine.c]};">동선:</span> ${pathList}
                </div>
            </div>
        </div>
    `;
    marker.bindPopup(popupContent);
    marker.on('mouseover', () => polyline.setStyle({ opacity: 0.7 }));
    marker.on('mouseout', () => polyline.setStyle({ opacity: 0 }));
});

// 5. 스폰 지점 마커
L.marker(mcToPx(spawnData.mcX, spawnData.mcZ), { icon: compassIcon })
    .addTo(map)
    .bindPopup(`<div style="color:#000; font-weight:bold; font-size:14px; text-align:center;">스폰 지점</div>`);

// 6. 광산 마커 생성
mines.forEach((mine) => {
    const pos = mcToPx(mine.x, mine.z);
    const mineIcon = L.divIcon({
        className: `mine-marker mine-${mine.c}`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    const marker = L.marker(pos, { icon: mineIcon }).addTo(map);

    const specificOres = mineResources[mine.c];
    const commonOres = mineResources["공통"];
    const pathList = minePaths[mine.c].join(' > ');

    // mines.forEach 내부의 popupContent 변수 부분만 교체하세요!

    const popupContent = `
        <div style="text-align:center; min-width:240px; color:#000; padding: 0;">
            <div style="font-size:22px; font-weight:800; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:12px; word-break:keep-all;">
                ${mine.n}번 광산 <span style="font-size:14px; font-weight:700; color:${mineColors[mine.c]};">(${specificOres})</span>
            </div>
            
            <div style="background:#333; border-radius:4px; padding:6px 0; margin-bottom:12px; cursor:pointer;" 
                 onclick="copyCoords(${mine.x}, ${mine.y}, ${mine.z})">
                <div style="color:#FFD700; font-size:17px; font-weight:700; letter-spacing:0.5px; line-height:1.2;">
                    ${mine.x}, ${mine.y}, ${mine.z}
                </div>
                <div style="color:#aaa; font-size:11px; margin-top:2px;">(클릭하여 좌표 복사)</div>
            </div>

            <div style="font-size:13px; color:#333; line-height:1.5; letter-spacing:-0.3px; border-top:1px solid #aaa; padding-top:8px;">
                <div style="margin-bottom:6px; font-weight:600; color:#666;">[공통] ${commonOres}</div>
                <div style="font-weight:700; word-break:break-all;">
                    <span style="color:${mineColors[mine.c]};">동선:</span> ${pathList}
                </div>
            </div>
        </div>
    `;
    marker.bindPopup(popupContent);
    marker.on('mouseover', () => minePolylines[mine.c].setStyle({ opacity: 0.8 }));
    marker.on('mouseout', () => minePolylines[mine.c].setStyle({ opacity: 0 }));
});
