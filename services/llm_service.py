import os
import json
import logging
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

logger = logging.getLogger(__name__)

_client = None


class PlacesError(Exception):
    """LLM kullanılabilir bir yer listesi döndürmediğinde fırlatılır."""


def get_client():
    # İstemciyi ilk istekte oluşturuyoruz; anahtar yoksa uygulama yine de açılır
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client


def parse_places(raw: str):
    try:
        places = json.loads(raw)["places"]
    except (TypeError, ValueError, KeyError) as error:
        raise PlacesError("LLM geçerli JSON döndürmedi") from error

    if not isinstance(places, list):
        raise PlacesError("LLM yer listesi döndürmedi")
    for place in places:
        if not isinstance(place, dict) or not {"name", "lat", "lng"} <= place.keys():
            raise PlacesError("LLM eksik alanlı bir yer döndürdü")
    return places


async def generate_places(city: str, interests: list, stop_count: int):
    prompt = f"""
    Create a JSON list of {stop_count} travel locations in {city}.
    Interests: {', '.join(interests)}.

    Format:
    {{
        "places": [
            {{
                "name": "string",
                "lat": number,
                "lng": number
            }}
        ]
    }}

    Output ONLY valid JSON.
    """

    # Async istemci, LLM yanıtını beklerken diğer istekleri bloklamaz
    response = await get_client().chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You generate travel locations ONLY in JSON."},
            {"role": "user", "content": prompt}
        ]
    )

    raw = response.choices[0].message.content
    logger.debug("LLM raw output: %s", raw)

    return parse_places(raw)
