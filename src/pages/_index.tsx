import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView } from "motion/react";
import { CalendarDays, Building2, Users, Sparkles, ArrowRight } from "lucide-react";

const IMAGENES = [
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format", alt: "Conferencia con público" },
  { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80&auto=format", alt: "Concierto universitario" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80&auto=format", alt: "Estudiantes celebrando" },
  { src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80&auto=format", alt: "Ponencia en auditorio" },
  { src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80&auto=format", alt: "Sala de clases llena" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&auto=format", alt: "Festival al aire libre" },
];

const DEPARTAMENTOS = [
  { titulo: "Ingeniería y Tecnología", desc: "Hackatones, ferias de proyectos y charlas de la industria." },
  { titulo: "Ciencias de la Salud", desc: "Jornadas, talleres clínicos y campañas de bienestar." },
  { titulo: "Económico-Administrativas", desc: "Foros de emprendimiento, networking y casos reales." },
  { titulo: "Ciencias Sociales y Humanidades", desc: "Conversatorios, exposiciones y actividades culturales." },
];

const ESTADISTICAS = [
  { etiqueta: "Usuarios registrados", valor: 4678 },
  { etiqueta: "Eventos creados", valor: 23170 },
  { etiqueta: "Estudiantes en la universidad", valor: 9567 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setValor(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref}>
      {valor.toLocaleString("es-MX")}
      <span className="text-text-light/70">+</span>
    </span>
  );
}

const IndexView: React.FC = () => {
  return (
    <main className="overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-main mb-6"
          >
            Vive los <span className="text-primary">eventos</span>
            <br />
            de tu universidad
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-lg md:text-xl text-text-muted mb-10"
          >
            Conferencias, talleres, conciertos y actividades de todos los
            departamentos en un solo lugar. Regístrate, participa y no te pierdas
            nada de la vida universitaria.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/registro"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-text-light transition-colors hover:bg-primary-hover"
            >
              Crear cuenta
              <ArrowRight className="size-5" />
            </a>
            <a
              href="/eventos"
              className="inline-flex items-center gap-2 rounded-xl border border-border-custom bg-bg-alt px-7 py-3.5 text-base font-semibold text-text-main transition-colors hover:bg-bg-main"
            >
              Ver eventos
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-8" aria-label="Eventos anteriores">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[...IMAGENES, ...IMAGENES].map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-56 w-80 shrink-0 rounded-xl object-cover"
              />
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 py-20 text-center"
      >
        <CalendarDays className="mx-auto size-12 text-primary mb-6" />
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mb-6">
          Una sola plataforma para <span className="text-primary">toda</span> la
          actividad universitaria
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-text-muted">
          Eventues reúne todos los eventos públicos de la Universidad Estatal de
          Sonora. Explora por campus, categoría o fecha, descubre lo que está por
          venir e inscríbete en segundos. Tu próxima experiencia universitaria
          empieza aquí.
        </p>
      </motion.section>

      <section className="bg-bg-alt border-y border-border-custom">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <Building2 className="mx-auto size-12 text-primary mb-6" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mb-4">
              Eventos de todos los <span className="text-primary">departamentos</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-text-muted">
              Cada área de la universidad organiza sus propias actividades.
              Encuéntralas todas en un mismo lugar.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.12 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {DEPARTAMENTOS.map((d) => (
              <motion.div
                key={d.titulo}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-border-custom bg-bg-card p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-text-main mb-2">{d.titulo}</h3>
                <p className="text-sm text-text-muted">{d.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <a
              href="/departamentos"
              className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-hover"
            >
              Explorar departamentos
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-primary text-text-light">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center text-2xl md:text-4xl font-extrabold mb-14"
          >
            La comunidad Eventues en números
          </motion.h2>

          <div className="grid gap-12 sm:grid-cols-3 text-center">
            {ESTADISTICAS.map((e) => (
              <div key={e.etiqueta} className="flex flex-col items-center gap-3">
                <Users className="size-8 text-text-light/80" />
                <p className="text-5xl md:text-6xl font-extrabold tracking-tight">
                  <CountUp target={e.valor} />
                </p>
                <p className="text-base font-medium text-text-light/80">
                  {e.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 py-24 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mb-6">
          ¿Listo para <span className="text-primary">participar</span>?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-text-muted mb-10">
          Crea tu cuenta gratis y forma parte de la comunidad. Recibe los eventos
          que te interesan e inscríbete con un clic.
        </p>
        <a
          href="/registro"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-text-light transition-colors hover:bg-primary-hover"
        >
          Registrarme ahora
          <ArrowRight className="size-5" />
        </a>
      </motion.section>
    </main>
  );
};

export default IndexView;
