import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props<T extends FieldValues> extends Omit<React.ComponentProps<"input">, "name"> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

function CampoTexto<T extends FieldValues>({ control, name, label, required, className, ...inputProps }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="gap-2" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} required={required}>
            {label}
          </FieldLabel>
          <Input
            {...inputProps}
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            className={cn("h-11 bg-bg-main px-4", className)}
          />
          {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
    />
  );
}

export default CampoTexto;
