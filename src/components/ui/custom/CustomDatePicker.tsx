import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface CustomDatePickerProps {
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined, time: string) => void;
}

export default function CustomDatePicker({ selectedDate, onDateChange }: CustomDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate || undefined);
  const [time, setTime] = React.useState<string>("12:00"); // Default time is 12:00

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateChange && onDateChange(newDate || undefined, time);
  };

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
          {date ? format(date, "PPP") + ` at ${time}` : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
        <div className="p-4">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
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
