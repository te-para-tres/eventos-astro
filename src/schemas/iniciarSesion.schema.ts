import { z } from "zod";

export const IniciarSesionSchema = z.object({
  correo: z
    .string({ required_error: "El correo es obligatorio" })
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo válido"),
  clave: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria"),
});

export type IniciarSesionFormData = z.infer<typeof IniciarSesionSchema>;
