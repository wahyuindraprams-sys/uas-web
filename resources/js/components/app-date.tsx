import * as React from 'react';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import {
    format,
    setMonth,
    setYear,
    isSameMonth,
    setHours,
    setMinutes,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

export type AppDateProps = {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    type?: 'date' | 'datetime' | 'month';
    className?: string;
    disabled?: boolean;
};

export function AppDate({
    value,
    onChange,
    placeholder = 'Pilih tanggal...',
    type = 'date',
    className,
    disabled = false,
}: AppDateProps) {
    const [open, setOpen] = React.useState(false);
    const [monthYear, setMonthYear] = React.useState<Date>(value || new Date());

    const getDisplayValue = () => {
        if (!value) return placeholder;
        if (type === 'month') return format(value, 'MMMM yyyy', { locale: id });
        if (type === 'datetime')
            return format(value, 'PPP HH:mm', { locale: id });
        return format(value, 'PPP', { locale: id });
    };

    const handleMonthSelect = (m: number) => {
        const newDate = setMonth(monthYear, m);
        onChange?.(newDate);
        setOpen(false);
    };

    const handleYearChange = (offset: number) => {
        setMonthYear(setYear(monthYear, monthYear.getFullYear() + offset));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return;
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const newDate = setMinutes(setHours(value, hours), minutes);
        onChange?.(newDate);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'h-10 w-full justify-start px-3 text-left font-normal',
                        !value && 'text-muted-foreground',
                        className,
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="truncate">{getDisplayValue()}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                {type === 'month' ? (
                    <div className="w-[280px] p-3">
                        <div className="mb-4 flex items-center justify-between px-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleYearChange(-1)}
                            >
                                <span className="sr-only">Previous Year</span>
                                {'<'}
                            </Button>
                            <div className="text-sm font-semibold">
                                {monthYear.getFullYear()}
                            </div>
                            <Button
                                variant={'outline'}
                                className="h-7 w-7"
                                onClick={() => handleYearChange(1)}
                            >
                                <span className="sr-only">Next Year</span>
                                {'>'}
                            </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }).map((_, i) => {
                                const monthDate = setMonth(monthYear, i);
                                const isSelected =
                                    value && isSameMonth(value, monthDate);
                                return (
                                    <Button
                                        key={i}
                                        variant={
                                            isSelected ? 'default' : 'ghost'
                                        }
                                        className="h-9 w-full text-xs font-normal"
                                        onClick={() => handleMonthSelect(i)}
                                    >
                                        {format(monthDate, 'MMM', {
                                            locale: id,
                                        })}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <Calendar
                            mode="single"
                            selected={value}
                            locale={id}
                            onSelect={(d) => {
                                if (type === 'date') {
                                    onChange?.(d);
                                    setOpen(false);
                                } else {
                                    onChange?.(d);
                                }
                            }}
                            initialFocus
                        />
                        {type === 'datetime' && value && (
                            <div className="flex items-center gap-3 border-t border-border bg-muted/30 p-3">
                                <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
                                    <Clock className="size-3.5" />
                                    <span>Waktu:</span>
                                </div>
                                <Input
                                    type="time"
                                    value={format(value, 'HH:mm')}
                                    onChange={handleTimeChange}
                                    className="h-8 py-1 text-xs focus-visible:ring-blue-500"
                                />
                                <Button
                                    size="sm"
                                    className="h-8 bg-blue-600 px-3 text-xs hover:bg-blue-700"
                                    onClick={() => setOpen(false)}
                                >
                                    Selesai
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
