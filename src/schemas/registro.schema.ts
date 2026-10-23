import { z } from "zod";

export const RegistroSchema = z
  .object({
    expediente: z
      .string({ required_error: "El expediente es obligatorio" })
      .trim()
      .min(1, "El expediente es obligatorio")
      .length(11, "El expediente debe ser de 11 números")
      .regex(/^\d+$/, "El expediente debe contener solo números"),
    nombre: z
      .string({ required_error: "El nombre es obligatorio" })
      .trim()
      .min(1, "El nombre es obligatorio"),
    apellidos: z
      .string({ required_error: "Los apellidos son obligatorios" })
      .trim()
      .min(1, "Los apellidos son obligatorios"),
    correo: z
      .string({ required_error: "El correo es obligatorio" })
      .trim()
      .min(1, "El correo es obligatorio")
      .email("Ingresa un correo válido"),
    telefono: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "El teléfono debe ser de 10 números")
      .or(z.literal("")),
    idUnidadAcademica: z
      .string({ required_error: "La unidad académica es obligatoria" })
      .min(1, "La unidad académica es obligatoria"),
    idCarrera: z
      .string({ required_error: "La carrera es obligatoria" })
      .min(1, "La carrera es obligatoria"),
    clave: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmarClave: z.string({ required_error: "Confirma tu contraseña" }),
  })
  .refine((datos) => datos.clave === datos.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
  });

export type RegistroFormData = z.infer<typeof RegistroSchema>;
