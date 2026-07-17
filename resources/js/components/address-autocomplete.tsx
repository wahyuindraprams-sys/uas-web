import { LoaderCircle, MapPin, Search } from 'lucide-react';
import * as React from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

type SavedOption = {
    label: string;
    address: string;
    city: string;
};

type NominatimResult = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    address: {
        road?: string;
        pedestrian?: string;
        neighbourhood?: string;
        suburb?: string;
        village?: string;
        town?: string;
        city?: string;
        municipality?: string;
        county?: string;
        state?: string;
        country?: string;
    };
};

type AddressAutocompleteProps = {
    id: string;
    label: string;
    value: string;
    city?: string;
    onChange: (value: string) => void;
    onSelect: (
        address: string,
        city: string,
        lat: number | null,
        lng: number | null,
    ) => void;
    error?: string;
    placeholder: string;
    required?: boolean;
    savedOptions?: SavedOption[];
};

function extractCityFromNominatim(addr: NominatimResult['address']): string {
    return (
        addr.city ??
        addr.town ??
        addr.municipality ??
        addr.village ??
        addr.county ??
        addr.state ??
        ''
    );
}

function extractShortAddress(result: NominatimResult): string {
    const addr = result.address;
    const parts: string[] = [];

    const street =
        addr.road ?? addr.pedestrian ?? addr.neighbourhood ?? addr.suburb ?? '';

    if (street) {
        parts.push(street);
    }

    const city = extractCityFromNominatim(addr);

    if (city) {
        parts.push(city);
    }

    return parts.length > 0
        ? parts.join(', ')
        : result.display_name.split(',').slice(0, 2).join(',').trim();
}

export function AddressAutocomplete({
    id,
    label,
    value,
    city,
    onChange,
    onSelect,
    error,
    placeholder,
    required = false,
}: AddressAutocompleteProps) {
    const [query, setQuery] = React.useState(value);
    const [suggestions, setSuggestions] = React.useState<NominatimResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [fetchError, setFetchError] = React.useState<string | null>(null);
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const containerRef = React.useRef<HTMLDivElement>(null);
    const abortRef = React.useRef<AbortController | null>(null);

    React.useEffect(() => {
        setQuery(value);
    }, [value]);

    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
        setFetchError(null);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (abortRef.current) {
            abortRef.current.abort();
        }

        if (val.trim().length < 3) {
            setSuggestions([]);
            setOpen(false);
            setLoading(false);

            return;
        }

        debounceRef.current = setTimeout(async () => {
            const controller = new AbortController();
            abortRef.current = controller;
            setLoading(true);
            setOpen(false);

            try {
                const params = new URLSearchParams({
                    q: val.trim(),
                    format: 'json',
                    addressdetails: '1',
                    limit: '6',
                    countrycodes: 'id',
                });
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                    {
                        signal: controller.signal,
                        headers: { 'Accept-Language': 'id,en' },
                    },
                );

                if (!res.ok) {
                    throw new Error('Gagal mengambil saran alamat.');
                }

                const data: NominatimResult[] = await res.json();
                setSuggestions(data);
                setOpen(data.length > 0);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    setFetchError(
                        'Gagal memuat saran. Periksa koneksi internet.',
                    );
                }
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    const handleSelect = (result: NominatimResult) => {
        const shortAddress = extractShortAddress(result);
        const selectedCity = extractCityFromNominatim(result.address);
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setQuery(shortAddress);
        onChange(shortAddress);
        setSuggestions([]);
        setOpen(false);
        onSelect(shortAddress, selectedCity, lat, lng);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <div className="grid gap-2" ref={containerRef}>
            <Label htmlFor={id} className="text-sm font-medium text-slate-700">
                {label}{' '}
                {required ? <span className="text-red-500">*</span> : null}
            </Label>

            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="pointer-events-none absolute left-3 size-4 text-slate-400" />
                    <input
                        id={id}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setOpen(true)}
                        placeholder={placeholder}
                        autoComplete="off"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-9 text-sm text-slate-900 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                    />
                    {loading && (
                        <LoaderCircle className="pointer-events-none absolute right-3 size-4 animate-spin text-slate-400" />
                    )}
                </div>

                {open && suggestions.length > 0 && (
                    <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                        {suggestions.map((result) => {
                            const short = extractShortAddress(result);
                            const detail = result.display_name;

                            return (
                                <li
                                    key={result.place_id}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(result);
                                    }}
                                    className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-blue-50"
                                >
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-blue-500" />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium text-slate-800">
                                            {short}
                                        </span>
                                        <span className="line-clamp-1 text-xs text-slate-400">
                                            {detail}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {city ? (
                <p className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="size-3.5" />
                    Kota terdeteksi: {city}
                </p>
            ) : null}

            {fetchError ? (
                <p className="text-xs text-amber-600">{fetchError}</p>
            ) : null}
            <InputError message={error} />
        </div>
    );
}
