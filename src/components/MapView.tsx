import { useMemo } from "react";
// import { APIProvider, Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
// import type { RouteInfo } from "../type";
import { useTripStore } from "../store/useTripStore";

export default function MapView() {
    // Zustand store'dan places ve route al
    const places = useTripStore((state) => state.places);
    // const route = useTripStore((state) => state.route);

    // Harita merkezini hesapla
    const center = useMemo(() => {
        if (!places.length) return { lat: 41.0151, lng: 28.9795 }; // İstanbul default
        const lat = places.reduce((sum, place) => sum + place.lat, 0) / places.length;
        const lon = places.reduce((sum, place) => sum + place.lon, 0) / places.length;
        return { lat, lng: lon };
    }, [places]);

    // const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

    // GEÇİCİ: Google Maps API Key bekliyor, şimdilik placeholder göster
    return (
        <div className="flex h-[520px] w-full items-center justify-center rounded-3xl bg-slate-100">
            <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold text-slate-700">Harita Bölümü</h3>
                <p className="mt-2 text-sm text-slate-500">
                    Google Maps API Key eklendikten sonra<br />
                    harita ve rota burada görünecek
                </p>
                {places.length > 0 && (
                    <div className="mt-4 text-xs text-slate-400">
                        Merkez: {center.lat.toFixed(4)}°N, {center.lng.toFixed(4)}°E
                    </div>
                )}
            </div>
        </div>
    );

    /* GERÇEK HARITA KODU - API KEY EKLENINCE AKTİF OLACAK
    return (
        <APIProvider apiKey={apiKey}>
            <Map
                center={center}
                defaultZoom={13}
                mapId="ai-tripper-map"
                className="h-[520px] w-full rounded-3xl"
                gestureHandling="greedy"
                disableDefaultUI={false}
            >
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        position={{ lat: place.lat, lng: place.lon }}
                        title={place.name}
                    />
                ))}
                {route && <RoutePolyline route={route} />}
            </Map>
        </APIProvider>
    );
    */
}

/* POLYLINE COMPONENT - API KEY EKLENINCE AKTİF OLACAK
// Polyline component - Haritada rota çizgisi çizer
function RoutePolyline({ route }: { route: RouteInfo }) {
    const map = useMap();
    const mapsLibrary = useMapsLibrary("maps");

    // Polyline objesini oluştur ve haritaya ekle
    useMemo(() => {
        if (!map || !mapsLibrary) return null;

        // Çizgi rengi - walk=yeşil, drive=mavi
        const strokeColor = route.mode === "walk" ? "#10b981" : "#3b82f6";

        // Polyline oluştur
        const polyline = new mapsLibrary.Polyline({
            path: route.polyline.map(([lat, lon]) => ({ lat, lng: lon })),
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 4,
        });

        // Haritaya ekle
        polyline.setMap(map);

        // Cleanup - component unmount olunca çizgiyi kaldır
        return () => {
            polyline.setMap(null);
        };
    }, [map, mapsLibrary, route]);

    return null; // Bu component görsel bir şey render etmez
}
*/
