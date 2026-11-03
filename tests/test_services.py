import pytest

from services.llm_service import PlacesError, parse_places
from services.route_service import RouteError, build_params, summarize_route

PLACES = [
    {"name": "Galata Kulesi", "lat": 41.0256, "lng": 28.9742},
    {"name": "Ayasofya", "lat": 41.0086, "lng": 28.9802},
    {"name": "Kapalıçarşı", "lat": 41.0107, "lng": 28.9681},
]


def test_parse_places():
    raw = '{"places": [{"name": "Ayasofya", "lat": 41.0, "lng": 28.9}]}'

    assert parse_places(raw)[0]["name"] == "Ayasofya"


@pytest.mark.parametrize("raw", [
    "not json",
    None,
    '{"items": []}',
    '{"places": "Ayasofya"}',
    '{"places": [{"name": "Ayasofya"}]}',
])
def test_parse_places_rejects_bad_output(raw):
    with pytest.raises(PlacesError):
        parse_places(raw)


def test_params_put_middle_stops_in_waypoints():
    params = build_params(PLACES, "walking")

    assert params["origin"] == "41.0256,28.9742"
    assert params["destination"] == "41.0107,28.9681"
    assert params["waypoints"] == "optimize:true|41.0086,28.9802"
    assert params["mode"] == "walking"


def test_two_stops_have_no_waypoints():
    assert "waypoints" not in build_params(PLACES[:2], "driving")


def test_summarize_route_adds_up_legs():
    data = {
        "status": "OK",
        "routes": [{
            "overview_polyline": {"points": "abc"},
            "legs": [
                {"distance": {"value": 1500}, "duration": {"value": 600}},
                {"distance": {"value": 2250}, "duration": {"value": 930}},
            ],
        }],
    }

    assert summarize_route(data) == {"route": "abc", "distance_km": 3.75, "duration_min": 25.5}


def test_summarize_route_raises_on_api_error():
    with pytest.raises(RouteError, match="ZERO_RESULTS"):
        summarize_route({"status": "ZERO_RESULTS"})
