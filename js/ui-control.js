// js/ui-control.js

const compassIcon = L.icon({
    iconUrl: 'images/compass.png',
    iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -10]
});

const transparentIcon = L.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 
    iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15]
});

const animalPathPoints = animals.map(ani => mcToPx(ani.mcX, ani.mcZ));
const polyline = L.polyline(animalPathPoints, {
    color: '#FFD700', weight: 2, opacity: 0, dashArray: '5, 8'
}).addTo(map);

window.copyCoords = (x, y, z) => {
    const text = `${x} ${y} ${z}`; 
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('copy-toast');
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 1500);
    });
};

// --- 이 부분(정보창 디자인) 위주로 수정되었습니다 ---
animals.forEach((ani) => {
    const pos = mcToPx(ani.mcX, ani.mcZ);
    const marker = L.marker(pos, { icon: transparentIcon }).addTo(map);

    const popupContent = `
        <div style="text-align:center; min-width:170px; color:#000;">
            <div style="font-size:17px; font-weight:800; border-bottom:1px solid #999; padding-bottom:5px; margin-bottom:8px;">
                ${ani.order}. ${ani.name}
            </div>
            
            <div style="background:#333; border-radius:3px; padding:6px 0; margin-bottom:8px; cursor:pointer;" 
                 onclick="copyCoords(${ani.mcX}, ${ani.mcY}, ${ani.mcZ})">
                <div style="color:#FFD700; font-size:13px; font-weight:600;">
                    ${ani.mcX}, ${ani.mcY}, ${ani.mcZ}
                </div>
                <div style="color:#aaa; font-size:9px; margin-top:2px;">(클릭하여 좌표 복사)</div>
            </div>

            <div style="color:#7000CA; font-weight:800; font-size:12px; margin-bottom:5px;">
                *[히든]십이지신
            </div>
            
            <div style="font-size:10px; color:#444; line-height:1.4; letter-spacing:-0.5px;">
                쥐>소>호랑이><span style="color:#d00; font-weight:bold;">도사</span>>토끼>용>뱀><span style="color:#d00; font-weight:bold;">도사</span><br>
                말>양>원숭이><span style="color:#d00; font-weight:bold;">도사</span>>닭>개>돼지><span style="color:#d00; font-weight:bold;">도사</span>
            </div>
        </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('mouseover', () => polyline.setStyle({ opacity: 0.7 }));
    marker.on('mouseout', () => polyline.setStyle({ opacity: 0 }));
});

// 스폰 지점 마커 (통일감을 위해 검은색 굵은 글씨 적용)
L.marker(mcToPx(spawnData.mcX, spawnData.mcZ), { icon: compassIcon })
    .addTo(map)
    .bindPopup(`<div style="color:#000; font-weight:bold; font-size:14px; text-align:center;">스폰 지점</div>`);
