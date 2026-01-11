'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Mock data for geographic distribution (Harare area as per existing FencingMap)
const MOCK_LOCATIONS = [
    { name: 'Borrowdale', lat: -17.75, lng: 31.08, count: 12 },
    { name: 'Mount Pleasant', lat: -17.78, lng: 31.03, count: 8 },
    { name: 'Avondale', lat: -17.80, lng: 31.02, count: 15 },
    { name: 'Greystone Park', lat: -17.76, lng: 31.11, count: 5 },
    { name: 'Highlands', lat: -17.81, lng: 31.09, count: 10 },
];

export function DashboardMap() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-full w-full bg-accent/20 animate-pulse rounded-lg" />;

    return (
        <div className="h-full w-full relative rounded-lg overflow-hidden border border-black/5">
            <MapContainer 
                center={[-17.8248, 31.0530] as any} 
                zoom={11} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {MOCK_LOCATIONS.map((loc, i) => (
                    <CircleMarker 
                        key={i} 
                        center={[loc.lat, loc.lng]} 
                        radius={loc.count} 
                        pathOptions={{ 
                            fillColor: '#FFB700', 
                            color: '#FFB700', 
                            weight: 1, 
                            fillOpacity: 0.6 
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                {loc.name}: {loc.count} Jobs
                            </span>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
            
            <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm p-2 border border-black/5 rounded shadow-sm">
                <p className="text-[8px] font-black uppercase tracking-widest text-primary">Job Density</p>
            </div>
        </div>
    );
}
