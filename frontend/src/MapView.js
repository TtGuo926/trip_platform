import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidGllLWciLCJhIjoiY21iNmN1cDhyMjZhMzJqcjAzemVmMzAyZSJ9.rSD-k_oRxCdaIjRWs79xcQ';

export default function MapView() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 20],
      zoom: 2
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (!map) return;

    fetch('http://localhost:5000/api/checkins')
      .then(res => res.json())
      .then(data => {
        data.forEach(point => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h4>打卡描述</h4>
            <p>${point.description || '无描述'}</p>
            <p><small>${new Date(point.created_at).toLocaleString()}</small></p>
          `);

          new mapboxgl.Marker()
            .setLngLat([point.longitude, point.latitude])
            .setPopup(popup)
            .addTo(map);
        });
      })
      .catch(err => console.error('加载打卡点失败:', err));
  }, [map]);

  useEffect(() => {
    if (!map) return;

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      fetch('http://localhost:5000/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          description: '地图上点击打卡'
        })
      })
        .then(res => res.json())
        .then(data => {
          alert('✅ 打卡成功');
        })
        .catch(err => console.error('❌ 打卡失败', err));
    });
  }, [map]);

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "10px" }}>地图打卡平台</h2>
      <div
        ref={mapRef}
        style={{ height: "80vh", width: "100%", borderRadius: "12px" }}
      />
    </div>
  );
}
