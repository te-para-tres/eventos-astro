type DateFilterPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function DateFilterPicker({ value, onChange, disabled = false }: DateFilterPickerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/25">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Fecha
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-semibold text-primary transition-all duration-300 hover:text-primary-hover cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <i className="fa-regular fa-calendar text-primary" aria-hidden="true"></i>
        <input
          type="date"
          aria-label="Filtrar por fecha"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  );
}
