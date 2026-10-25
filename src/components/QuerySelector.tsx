import React from "react";
import type { ModeloBase } from "../types/ModeloBase.model";
import { toast } from "sonner";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { http } from "@/hooks/http";

interface Props<T extends ModeloBase> {
  endpoint: string;
  placeholder: string;
  value?: any;
  queryProps?: Record<string, any>;
  labelKey?: keyof T;
  onValueChange: (v: any) => void;
  optionRender?: (data: T) => React.ReactNode;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

function QuerySelector<T extends ModeloBase>({
  queryProps,
  endpoint,
  placeholder,
  value,
  labelKey = "nombre" as keyof T,
  onValueChange,
  optionRender,
  id,
  invalid,
  disabled,
  className,
}: Props<T>) {
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);

  const selected = React.useMemo(
    () => items.find((item) => item.id === value) ?? null,
    [items, value],
  );

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await http.get(endpoint, { ...queryProps });
        if (res.isError) return toast.error("Ocurrió un error al obtener los elementos");
        setItems(res.resultado as T[]);
      } catch {
        toast.error("Ocurrió un error al obtener los elementos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Combobox<T>
      value={selected}
      items={items}
      autoHighlight
      itemToStringLabel={(item) => String(item?.[labelKey] ?? item?.id ?? "")}
      itemToStringValue={(item) => String(item?.id ?? "")}
      isItemEqualToValue={(a, b) => a?.id === b?.id}
      onValueChange={(item) => onValueChange(item?.id ?? "")}
    >
      <ComboboxInput
        id={id}
        aria-invalid={invalid || undefined}
        placeholder={placeholder}
        disabled={disabled || loading}
        className={className}
      />
      <ComboboxContent>
        <ComboboxEmpty>No se encontraron elementos.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={`id-${item.id}`} value={item}>
              {optionRender ? optionRender(item) : String(item[labelKey] ?? item.id)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default QuerySelector;
