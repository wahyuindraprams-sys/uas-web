import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export type AppSelectOption = {
    label: string;
    value: string;
};

export type AppSelectProps = {
    options: AppSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    type?: 'default' | 'search' | 'multi';
    value?: string | string[];
    onChange?: (value: any) => void;
    disabled?: boolean;
};

export function AppSelect({
    options,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    emptyText = 'No items found.',
    className,
    type = 'default',
    value,
    onChange,
    disabled = false,
}: AppSelectProps) {
    const [open, setOpen] = React.useState(false);
    if (type === 'default') {
        return (
            <Select
                value={value as string}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger className={className}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (type === 'search') {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'w-full justify-between rtl:flex-row-reverse',
                            !value && 'text-muted-foreground',
                            className,
                        )}
                        disabled={disabled}
                    >
                        <span className="truncate">
                            {value
                                ? options.find(
                                      (option) => option.value === value,
                                  )?.label
                                : placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                            onChange?.(
                                                option.value === value
                                                    ? ''
                                                    : option.value,
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === option.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }

    if (type === 'multi') {
        const selectedValues = Array.isArray(value) ? value : [];

        const handleSelect = (currentValue: string) => {
            if (selectedValues.includes(currentValue)) {
                onChange?.(selectedValues.filter((v) => v !== currentValue));
            } else {
                onChange?.([...selectedValues, currentValue]);
            }
        };

        const removeValue = (e: React.MouseEvent, valToRemove: string) => {
            e.stopPropagation();
            onChange?.(selectedValues.filter((v) => v !== valToRemove));
        };

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'h-auto min-h-10 w-full justify-between px-3 py-2',
                            className,
                        )}
                        disabled={disabled}
                    >
                        <div className="flex max-w-[90%] flex-wrap items-center gap-1">
                            {selectedValues.length === 0 && (
                                <span className="font-normal text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                            {selectedValues.map((val) => {
                                const opt = options.find(
                                    (o) => o.value === val,
                                );
                                return (
                                    <Badge
                                        variant="secondary"
                                        key={val}
                                        className="mr-1 pe-1 text-xs font-normal"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {opt?.label || val}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className="ml-1 rounded-full p-0.5 hover:bg-muted"
                                            onClick={(e) => removeValue(e, val)}
                                        >
                                            <X className="h-3 w-3" />
                                        </div>
                                    </Badge>
                                );
                            })}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = selectedValues.includes(
                                        option.value,
                                    );
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() =>
                                                handleSelect(option.value)
                                            }
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'opacity-50 [&_svg]:invisible',
                                                )}
                                            >
                                                <Check
                                                    className={cn('h-4 w-4')}
                                                />
                                            </div>
                                            {option.label}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }

    return null;
}
