from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from services.llm_service import PlacesError, generate_places
from services.route_service import RouteError, get_optimized_route

app = FastAPI()

class RouteRequest(BaseModel):
    city: str = Field(min_length=1)
    interests: list[str] = Field(min_length=1)
    # Rota için en az iki durak gerekir; Google en fazla 25 ara nokta kabul eder
    stop_count: int = Field(ge=2, le=10)
    travel_mode: Literal["driving", "walking", "bicycling", "transit"] = "walking"

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/generate-route")
async def generate_route(data: RouteRequest):
    # LLM ile yer önerileri üret
    try:
        places = await generate_places(
            city=data.city,
            interests=data.interests,
            stop_count=data.stop_count,
        )
    except PlacesError as error:
        raise HTTPException(status_code=502, detail=str(error))

    if len(places) < 2:
        raise HTTPException(status_code=502, detail="Rota için yeterli yer bulunamadı")

    # Google Maps ile rota optimizasyonu
    try:
        route_info = await get_optimized_route(
            places=places,
            travel_mode=data.travel_mode
        )
    except RouteError as error:
        raise HTTPException(status_code=502, detail=str(error))

    # Frontend'e JSON döndür
    return {
        "city": data.city,
        "places": places,
        "route": route_info["route"],
        "distance_km": route_info["distance_km"],
        "duration_min": route_info["duration_min"]
    }
