import { useState } from "react";
import PlaceCard from "./PlaceCard";
import { useTripStore } from "../store/useTripStore";

export default function PlaceList() {
    const [highlighted, setHighlighted] = useState<string | null>(null);

    // Zustand store'dan places al
    const places = useTripStore((state) => state.places);
    const isLoading = useTripStore((state) => state.isLoading);

    if (isLoading) {
        return (
            <section className="space-y-4 rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-slate-800">
                    Önerilen Duraklar
                </h2>
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                        <p className="text-sm text-slate-600">Yükleniyor...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Eğer henüz place yoksa bilgilendirici mesaj göster
    if (places.length === 0) {
        return (
            <section className="space-y-4 rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-slate-800">
                    Önerilen Duraklar
                </h2>
                <p className="text-sm text-slate-500">
                    Rota oluşturmak için formu doldurun
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                    Önerilen Duraklar
                </h2>
                <span className="text-sm text-slate-500">
                    {places.length} mekan
                </span>
            </div>

            <div className="space-y-3">
                {places.map((place) => (
                    <PlaceCard
                        key={place.id}
                        place={place}
                        isActive={highlighted === place.id}
                        onHover={setHighlighted}
                    />
                ))}
            </div>
        </section>
    );
}
