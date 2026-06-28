import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  value: string
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DatePicker: React.FC<Props> = ({ value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const selected = value ? dayjs(value).toDate() : undefined;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Fecha
        </span>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          disabled={disabled}
          aria-label="Filtrar por fecha"
          className="flex h-8 w-full items-center gap-2 border border-stone-300/80 rounded-lg px-3 text-sm font-medium text-gray-700 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarIcon className="size-4 text-gray-400" aria-hidden="true" />
          <span className={value ? "text-gray-700" : "text-stone-500 font-normal"}>
            {value ? dayjs(value).format("DD/MM/YYYY") : "Selecciona fecha"}
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={es}
            selected={selected}
            onSelect={(date) => {
              onChange(date ? dayjs(date).toISOString() : "");
              setOpen(false);
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
