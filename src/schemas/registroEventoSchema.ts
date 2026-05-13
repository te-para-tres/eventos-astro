import { z } from "zod";

export const RegistroEventoSchema = z.object({
  correo: z
    .string()
    .email("El correo es inválido")
    .trim(),
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(1, "El nombre es obligatorio")
    .trim(),
  expediente: z
    .string({ required_error: "El expediente es obligatorio" })
    .min(1, "El expediente es obligatorio")
    .length(11, "El expediente debe ser de 11 numeros")
    .regex(/^\d+$/, "El expediente debe contener solo numeros")
    .trim(),
  carrera: z
    .string({ required_error: "La carrera es obligatoria" })
    .min(1, "La carrera es obligatoria")
    .trim(),
  telefono: z
    .string({ required_error: "El télefono es obligatorio" })
    .min(1, "El télefono es obligatorio")
    .max(10, "El télefono debe de ser de 10 digitos")
    .trim(),
});

export type RegistroEventoFormData = z.infer<typeof RegistroEventoSchema>;