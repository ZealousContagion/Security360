'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface FencingMapProps {
    onLengthChange: (length: number) => void;
}

function MapEvents({ onPointAdd }: { onPointAdd: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            onPointAdd(e.latlng);
        },
    });
    return null;
}

export function FencingMap({ onLengthChange }: FencingMapProps) {
    const [points, setPoints] = useState<L.LatLng[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Fix for default marker icons in Leaflet + Next.js
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        setIsMounted(true);
    }, []);

    const calculateTotalLength = (pts: L.LatLng[]) => {
        let total = 0;
        for (let i = 0; i < pts.length - 1; i++) {
            total += pts[i].distanceTo(pts[i + 1]);
        }
        return Math.round(total);
    };

    const handleAddPoint = (latlng: L.LatLng) => {
        const newPoints = [...points, latlng];
        setPoints(newPoints);
        onLengthChange(calculateTotalLength(newPoints));
    };

    const resetMap = () => {
        setPoints([]);
        onLengthChange(0);
    };

    if (!isMounted) return <div className="h-full w-full bg-accent animate-pulse rounded-lg" />;

    return (
        <div className="relative h-full w-full group">
            <MapContainer 
                center={[-17.8248, 31.0530] as any} 
                zoom={18} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                {/* ESRI World Imagery (Satellite) - FREE, NO API KEY REQUIRED */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                />
                
                <MapEvents onPointAdd={handleAddPoint} />

                {points.length > 0 && (
                    <Polyline 
                        positions={points} 
                        pathOptions={{ color: '#FFB700', weight: 4 }} 
                    />
                )}

                {points.map((p, i) => (
                    <Marker key={i} position={p} interactive={false} />
                ))}
            </MapContainer>

            {/* HUD Overlay */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                <div className="bg-black/90 text-white p-4 rounded shadow-2xl border border-primary/20 backdrop-blur-sm">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Open-Source Mapping</p>
                    <h4 className="text-[10px] font-bold mt-1 uppercase tracking-widest">Perimeter Measurement</h4>
                    <p className="text-[9px] text-muted-foreground mt-2 font-medium">Click on the satellite map to draw the fence line.</p>
                    
                    <div className="flex gap-2 mt-4">
                        <button 
                            onClick={resetMap}
                            className="bg-white/10 hover:bg-white/20 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-colors"
                        >
                            Reset
                        </button>
                        <div className="bg-primary text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded">
                            {calculateTotalLength(points)}m Total
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 z-[1000] bg-black/50 text-white px-2 py-1 rounded text-[8px] uppercase tracking-widest pointer-events-none">
                Dev Mode: Esri Satellite Data
            </div>
        </div>
    );
}
