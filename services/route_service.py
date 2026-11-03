import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GOOGLE_MAPS_KEY = os.getenv("GOOGLE_MAPS_KEY")
DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"
REQUEST_TIMEOUT = 15


class RouteError(Exception):
    """Google Directions API rota döndüremediğinde fırlatılır."""


def build_params(places: list, travel_mode: str):
    # Koordinatları "lat,lng" formatında birleştiriyoruz
    coords = [f"{p['lat']},{p['lng']}" for p in places]

    params = {
        "origin": coords[0],
        "destination": coords[-1],
        "mode": travel_mode,
        "key": GOOGLE_MAPS_KEY,
    }
    # İlk ve son durak hariç; iki duraklı rotada ara nokta yok
    if len(coords) > 2:
        params["waypoints"] = "optimize:true|" + "|".join(coords[1:-1])
    return params


def summarize_route(data: dict):
    # Eğer hata varsa
    if data.get("status") != "OK":
        raise RouteError("Google Directions API hatası: " + str(data.get("status")))

    route = data["routes"][0]
    legs = route["legs"]

    # Toplam mesafe ve süre hesaplama
    total_distance_km = sum(l["distance"]["value"] for l in legs) / 1000
    total_duration_min = sum(l["duration"]["value"] for l in legs) / 60

    return {
        "route": route["overview_polyline"]["points"],
        "distance_km": round(total_distance_km, 2),
        "duration_min": round(total_duration_min, 1)
    }


async def get_optimized_route(places: list, travel_mode: str = "walking"):
    """
    Google Directions API kullanarak optimize rota hesaplama.
    places listesi:
    [
      {"name": "Galata Kulesi", "lat": 41.025, "lng": 28.974, "desc": "..."},
      ...
    ]
    """
    # httpx parametreleri kodlar; "|" ve isimlerdeki özel karakterler URL'yi bozmaz
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
        try:
            res = await client.get(DIRECTIONS_URL, params=build_params(places, travel_mode))
            data = res.json()
        except (httpx.HTTPError, ValueError) as error:
            raise RouteError("Google Directions API'ye ulaşılamadı") from error

    return summarize_route(data)
