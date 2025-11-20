🌍 AI TripPlanner Backend

Kişiselleştirilmiş Gezi Planlama Uygulaması - Backend Katmanı

Bu backend, FastAPI + Python ile geliştirilmiştir ve kullanıcıların seçtiği şehir, ilgi alanları ve ulaşım tercihlerine göre özelleştirilmiş gezi rotaları oluşturur.
Rotalar, OpenAI LLM (GPT modelleri) ve Google Maps Directions API kullanılarak oluşturulur.

🚀 Özellikler

📍 Şehir bazlı konum önerileri

🎯 İlgi alanlarına göre mekan üretimi (LLM tabanlı)

🧠 OpenAI kullanarak akıllı rota oluşturma

🗺️ Google Maps Directions API ile gerçek mesafe ve süre

⚡ Hızlı FastAPI altyapısı (ASGI)

🧪 Swagger UI ile test imkânı (otomatik dokümantasyon)

🛠️ Teknolojiler

Python 3.10+

FastAPI

OpenAI API

Google Maps Directions API

HTTPX (async HTTP istekleri için)

Uvicorn (ASGI server)

📁 Proje Yapısı
AI-Tripper-backend/
│── services/
│   ├── llm_service.py         # OpenAI ile yer önerisi üretimi
│   ├── route_service.py       # Google Maps Directions ile rota oluşturma
│── main.py                    # FastAPI ana uygulaması
│── requirements.txt           # Bağımlılıklar
└── README.md                  # Proje dökümanı

🔧 Kurulum
1️⃣ Sanal ortam oluştur
python -m venv venv

2️⃣ Sanal ortamı aktif et

Windows:

venv\Scripts\activate


Mac/Linux:

source venv/bin/activate

3️⃣ Bağımlılıkları yükle
pip install -r requirements.txt

🔑 Ortam Değişkenleri

Proje kök dizininde .env dosyası oluştur:

OPENAI_API_KEY=your_openai_key_here
GOOGLE_MAPS_KEY=your_google_maps_key_here


📌 Dikkat:
.env dosyasını asla GitHub’a yükleme — .gitignore içinde ignore edilmiştir.

▶️ Sunucuyu Çalıştır
uvicorn main:app --reload


Ardından tarayıcıdan:

👉 Swagger UI:
http://127.0.0.1:8000/docs

📡 API Endpoint
POST /generate-route

Örnek body:

{
  "city": "Istanbul",
  "interests": ["museum", "cafe"],
  "stop_count": 4,
  "travel_mode": "walking"
}


Dönen cevap:

{
  "city": "Istanbul",
  "places": [...],
  "route": "encoded_polyline_here",
  "distance_km": 2.1,
  "duration_min": 15
}

🧠 LLM Süreci Nasıl Çalışır?

Kullanıcı şehir + ilgi alanı gönderir

OpenAI "uygun mekan listesi" üretir

Backend mekanları Google Maps’e gönderir

Optimize edilmiş rota döner

📬 İletişim

Herhangi bir soru için:
📧 kayaal34 — GitHub Issues üzerinden ulaşabilirsiniz.
