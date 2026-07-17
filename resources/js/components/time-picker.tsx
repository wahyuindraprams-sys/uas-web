import * as React from 'react';
import { Clock } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const HOURS = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
); // 01–12
const MINUTES = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0'),
); // 00–59

type Period = 'AM' | 'PM';

function parse24h(value: string): {
    hour: string;
    minute: string;
    period: Period;
} {
    if (!value || !value.includes(':'))
        return { hour: '08', minute: '00', period: 'AM' };
    const [hStr, mStr] = value.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const period: Period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return {
        hour: String(hour12).padStart(2, '0'),
        minute: String(m).padStart(2, '0'),
        period,
    };
}

function to24h(hour: string, minute: string, period: Period): string {
    let h = parseInt(hour, 10);
    if (period === 'AM' && h === 12) h = 0;
    if (period === 'PM' && h !== 12) h += 12;
    return `${String(h).padStart(2, '0')}:${minute}`;
}

const ITEM_H = 36;

function ScrollColumn({
    items,
    selected,
    onSelect,
}: {
    items: string[];
    selected: string;
    onSelect: (v: string) => void;
}) {
    const ref = React.useRef<HTMLDivElement>(null);

    // Scroll selected item to top on open/change
    React.useLayoutEffect(() => {
        const idx = items.indexOf(selected);
        if (idx >= 0 && ref.current) {
            ref.current.scrollTop = idx * ITEM_H;
        }
    }, [selected, items]);

    return (
        <div
            ref={ref}
            className="flex h-[252px] flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
        >
            {items.map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => onSelect(item)}
                    style={{ height: ITEM_H }}
                    className={`flex w-14 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        item === selected
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}

type TimePickerProps = {
    value: string; // "HH:MM" 24h atau ""
    onChange: (value: string) => void;
    id?: string;
    disabled?: boolean;
};

export function TimePicker({ value, onChange, id, disabled }: TimePickerProps) {
    const [open, setOpen] = React.useState(false);

    const parsed = value
        ? parse24h(value)
        : { hour: '08', minute: '00', period: 'AM' as Period };
    const displayValue = value
        ? `${parsed.hour}:${parsed.minute} ${parsed.period}`
        : '';

    const handleHour = (h: string) =>
        onChange(to24h(h, parsed.minute, parsed.period));
    const handleMinute = (m: string) =>
        onChange(to24h(parsed.hour, m, parsed.period));
    const handlePeriod = (p: Period) =>
        onChange(to24h(parsed.hour, parsed.minute, p));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-xs transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span
                        className={`flex-1 text-left ${displayValue ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                        {displayValue || 'Pilih jam'}
                    </span>
                    <Clock className="size-4 shrink-0 text-slate-400" />
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-3" align="start">
                <div className="flex gap-1">
                    <ScrollColumn
                        items={HOURS}
                        selected={parsed.hour}
                        onSelect={handleHour}
                    />
                    <ScrollColumn
                        items={MINUTES}
                        selected={parsed.minute}
                        onSelect={handleMinute}
                    />

                    {/* AM / PM column */}
                    <div className="flex flex-col gap-1 pl-1">
                        {(['AM', 'PM'] as Period[]).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => handlePeriod(p)}
                                style={{ height: ITEM_H }}
                                className={`flex w-14 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                    p === parsed.period
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
