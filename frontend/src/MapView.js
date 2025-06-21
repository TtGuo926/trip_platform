// frontend/src/MapView.js
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidGllLWciLCJhIjoiY21iNmN1cDhyMjZhMzJqcjAzemVmMzAyZSJ9.rSD-k_oRxCdaIjRWs79xcQ'; 

export default function MapView() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 20],
      zoom: 2
    });

    mapInstance.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText(`打卡位置: ${lng.toFixed(4)}, ${lat.toFixed(4)}`))
        .addTo(mapInstance);

      setMarkers((prev) => [...prev, marker]);

      fetch('http://localhost:5000/api/checkin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    latitude: lat,
    longitude: lng,
    description: "我在这里打卡了！"
  })
})
.then(res => res.json())
.then(data => console.log('✅ 打卡成功:', data))
.catch(err => console.error('❌ 打卡失败:', err));

    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "10px" }}>地图打卡</h2>
      <div
        ref={mapContainerRef}
        style={{ height: "80vh", width: "100%", borderRadius: "12px" }}
      />
    </div>
  );
}
