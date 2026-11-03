import pytest
from fastapi.testclient import TestClient

import main
from services.llm_service import PlacesError
from services.route_service import RouteError

client = TestClient(main.app)

REQUEST = {"city": "İstanbul", "interests": ["tarih"], "stop_count": 3, "travel_mode": "walking"}
PLACES = [
    {"name": "Galata Kulesi", "lat": 41.0256, "lng": 28.9742},
    {"name": "Ayasofya", "lat": 41.0086, "lng": 28.9802},
]


@pytest.fixture
def services(monkeypatch):
    calls = {}

    async def fake_places(**kwargs):
        calls["places"] = kwargs
        return PLACES

    async def fake_route(places, travel_mode):
        calls["route"] = travel_mode
        return {"route": "abc", "distance_km": 2.1, "duration_min": 30.0}

    monkeypatch.setattr(main, "generate_places", fake_places)
    monkeypatch.setattr(main, "get_optimized_route", fake_route)
    return calls


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_generate_route(services):
    response = client.post("/generate-route", json=REQUEST)

    assert response.status_code == 200
    assert response.json()["places"] == PLACES
    assert response.json()["distance_km"] == 2.1
    assert services["places"]["stop_count"] == 3
    assert services["route"] == "walking"


@pytest.mark.parametrize("change", [
    {"stop_count": 1},
    {"stop_count": 50},
    {"travel_mode": "flying"},
    {"interests": []},
    {"city": ""},
])
def test_invalid_request_is_rejected(services, change):
    response = client.post("/generate-route", json={**REQUEST, **change})

    assert response.status_code == 422
    assert services == {}


def test_llm_error_returns_502(services, monkeypatch):
    async def broken_places(**kwargs):
        raise PlacesError("LLM geçerli JSON döndürmedi")

    monkeypatch.setattr(main, "generate_places", broken_places)

    assert client.post("/generate-route", json=REQUEST).status_code == 502


def test_route_error_returns_502(services, monkeypatch):
    async def broken_route(places, travel_mode):
        raise RouteError("Google Directions API hatası: ZERO_RESULTS")

    monkeypatch.setattr(main, "get_optimized_route", broken_route)

    response = client.post("/generate-route", json=REQUEST)
    assert response.status_code == 502
    assert "ZERO_RESULTS" in response.json()["detail"]
