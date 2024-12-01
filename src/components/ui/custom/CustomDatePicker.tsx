import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

/**
 * Props for the CustomDatePicker component.
 */

interface CustomDatePickerProps {
    /**
     * The currently selected date.
     * If not provided, the date picker will start without a pre-selected date.
     */

    selectedDate?: Date;

    /**
     * Callback triggered when the date or time is changed.
     * @param {Date | undefined} date - The selected date or `undefined` if no date is selected.
     * @param {string} time - The selected time in the format "HH:mm".
     */

    onDateChange?: (date: Date | undefined, time: string) => void;
}

/**
 * CustomDatePicker Component.
 * A date and time picker that allows the user to select a single date and a specific time.
 *
 * @param {CustomDatePickerProps} props - The props for the CustomDatePicker component.
 * @returns {JSX.Element} - The rendered CustomDatePicker component.
 */

export default function CustomDatePicker({
    selectedDate,
    onDateChange,
}: CustomDatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(
        selectedDate || undefined
    );
    const [time, setTime] = React.useState<string>("12:00"); // Default time is 12:00

    /**
     * Handles changes to the selected date.
     * Updates the internal state and triggers the `onDateChange` callback.
     *
     * @param {Date | undefined} newDate - The new selected date.
     */

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
        onDateChange && onDateChange(newDate || undefined, time);
    };

    /**
     * Handles changes to the selected time.
     * Updates the internal state and triggers the `onDateChange` callback.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event for the time input.
     */

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime);
        onDateChange && onDateChange(date || undefined, newTime);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "PPP") + ` at ${time}`
                    ) : (
                        <span>Pick a date and time</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                />
                <div className="p-4">
                    <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Select Time
                    </label>
                    <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        className="w-full"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
