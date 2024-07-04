import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // initial map center in [lng, lat]
      zoom: 9 // initial zoom level
    });

    map.current.on('load', () => {
      // Add GIS layers here
      map.current.addSource('some-gis-layer', {
        type: 'geojson',
        data: 'https://example.com/your-geojson-source'
      });

      map.current.addLayer({
        id: 'some-gis-layer',
        type: 'fill',
        source: 'some-gis-layer',
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.8
        }
      });

      // Add interactivity
      map.current.on('click', 'some-gis-layer', (e) => {
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<p>${e.features[0].properties.name}</p>`)
          .addTo(map.current);
      });

      map.current.on('mouseenter', 'some-gis-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'some-gis-layer', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });
  }, []);

  return <div ref={mapContainer} className="w-full h-[600px] mx-auto object-cover" />;
};

export default Map;