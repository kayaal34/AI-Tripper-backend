import type { TravelMode } from "../type";
import { useTripStore } from "../store/useTripStore";
import { useCreateRoute } from "../hooks/useCreateRoute";

const INTEREST_OPTIONS = [
    { id: "museum", label: "Müze" },
    { id: "cafe", label: "Kafe" },
    { id: "park", label: "Park" },
    { id: "art", label: "Sanat" },
    { id: "history", label: "Tarih" },
];

export default function RouteForm() {
    // Zustand store'dan state ve action'ları al
    const city = useTripStore((state) => state.city);
    const interests = useTripStore((state) => state.interests);
    const stops = useTripStore((state) => state.stops);
    const mode = useTripStore((state) => state.mode);
    const isLoading = useTripStore((state) => state.isLoading);
    const error = useTripStore((state) => state.error);

    const setCity = useTripStore((state) => state.setCity);
    const setInterests = useTripStore((state) => state.setInterests);
    const setStops = useTripStore((state) => state.setStops);
    const setMode = useTripStore((state) => state.setMode);

    // React Query mutation hook
    const { mutate: createRoute } = useCreateRoute();

    // İlgi alanı ekle/çıkar
    const toggleInterest = (id: string) => {
        const newInterests = interests.includes(id)
            ? interests.filter((item) => item !== id)
            : [...interests, id];
        setInterests(newInterests);
    };

    // Form submit - Backend'e istek at
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Validation
        if (!city.trim()) {
            alert("Lütfen bir şehir girin");
            return;
        }
        if (interests.length === 0) {
            alert("Lütfen en az bir ilgi alanı seçin");
            return;
        }

        // Backend'e istek gönder
        createRoute({ city, interests, stops, mode });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl bg-white p-6 shadow-xl"
        >
            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                    Şehir
                    <span className="ml-1 text-xs text-slate-500">
                        (Hedeflediğin destinasyon)
                    </span>
                </label>
                <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="İstanbul"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">
                        İlgi Alanları
                    </label>
                    <span className="text-xs text-slate-500">
                        Kaydırarak silebilirsin
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                        <button
                            type="button"
                            key={interest.id}
                            onClick={() => toggleInterest(interest.id)}
                            className={`rounded-full border px-4 py-1 text-sm transition ${interests.includes(interest.id)
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                                }`}
                        >
                            {interest.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1">
                <label className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    Durak Sayısı
                    <span className="text-xs text-slate-500">{stops} durak</span>
                </label>
                <input
                    type="range"
                    min={3}
                    max={10}
                    value={stops}
                    onChange={(event) => setStops(Number(event.target.value))}
                    className="w-full accent-emerald-500"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                    Seyahat Modu
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {(["walk", "drive"] satisfies TravelMode[]).map((option) => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => setMode(option)}
                            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${mode === option
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 text-slate-500 hover:border-slate-300"
                                }`}
                        >
                            {option === "walk" ? "Yürüyüş" : "Araç"}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-emerald-500 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? "Rota Oluşturuluyor..." : "Rota Oluştur"}
            </button>

            {/* Hata mesajı göster */}
            {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    <strong>Hata:</strong> {error}
                </div>
            )}
        </form>
    );
}
