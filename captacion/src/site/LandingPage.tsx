import ContactForm from "./ContactForm";
import { BRAND, BRAND_TAGLINE, CONTACT_EMAIL } from "../data/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <Hero />
      <Logos />
      <Problem />
      <Services />
      <Process />
      <Showcase />
      <Pricing />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          {BRAND}
          <span className="text-terracotta-500">.</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-ink-600 md:flex">
          <a href="#servicios" className="hover:text-ink">Servicios</a>
          <a href="#proceso" className="hover:text-ink">Cómo trabajamos</a>
          <a href="#ejemplos" className="hover:text-ink">Ejemplos</a>
          <a href="#precios" className="hover:text-ink">Precios</a>
        </nav>
        <a
          href="#contacto"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink-800"
        >
          Pide presupuesto
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-terracotta-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-pine-500/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-600">
            <span className="h-2 w-2 rounded-full bg-pine-500" /> Diseño web a medida · España
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Una web <span className="text-terracotta-500">única</span> para tu negocio local.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-600">
            Nada de plantillas recicladas. Creamos páginas hechas a mano que reflejan
            tu negocio, te encuentran en Google y convierten visitas en clientes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contacto"
              className="rounded-full bg-terracotta-500 px-6 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-terracotta-600"
            >
              Quiero mi web
            </a>
            <a
              href="#ejemplos"
              className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-sand"
            >
              Ver ejemplos
            </a>
          </div>
          <p className="mt-5 text-sm text-ink-400">Respuesta en menos de 24 h · Sin compromiso</p>
        </div>

        <div className="relative">
          <BrowserMock />
        </div>
      </div>
    </section>
  );
}

/** Maqueta visual de un navegador con una "web de negocio" dentro. */
function BrowserMock() {
  return (
    <div className="rotate-1 rounded-2xl border border-line bg-white shadow-lift">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 rounded-md bg-sand px-3 py-1 text-xs text-ink-400">tunegocio.es</span>
      </div>
      <div className="p-6">
        <div className="h-32 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600" />
        <div className="mt-4 h-4 w-2/3 rounded bg-sand" />
        <div className="mt-2 h-4 w-1/2 rounded bg-sand" />
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="h-16 rounded-lg bg-sand" />
          <div className="h-16 rounded-lg bg-sand" />
          <div className="h-16 rounded-lg bg-sand" />
        </div>
        <div className="mt-5 h-9 w-32 rounded-full bg-pine-500" />
      </div>
    </div>
  );
}

function Logos() {
  const items = ["Restaurantes", "Peluquerías", "Talleres", "Clínicas", "Tiendas", "Hoteles rurales"];
  return (
    <section className="border-y border-line bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 text-sm font-medium text-ink-400">
        <span className="text-ink-600">Trabajamos con:</span>
        {items.map((i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  const points = [
    {
      icon: "🔎",
      t: "No te encuentran",
      d: "Si no apareces en Google cuando alguien busca tu servicio en tu pueblo o barrio, ese cliente se va a la competencia.",
    },
    {
      icon: "📱",
      t: "Solo tienes Instagram",
      d: "Las redes están bien, pero no son tuyas. Una web propia da confianza, vende 24/7 y no depende de un algoritmo.",
    },
    {
      icon: "🧩",
      t: "Tu web actual da pena",
      d: "Lenta, anticuada o imposible de ver en el móvil. Una mala web transmite peor imagen que no tener ninguna.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
        Tu negocio es de fiar. Tu presencia online debería decirlo también.
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {points.map((p) => (
          <div key={p.t} className="rounded-2xl border border-line bg-white p-6 shadow-soft">
            <div className="text-3xl">{p.icon}</div>
            <h3 className="mt-3 font-display text-xl font-semibold">{p.t}</h3>
            <p className="mt-2 text-ink-600">{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { t: "Web a medida", d: "Diseño exclusivo, sin plantillas. Pensado para tu sector y tus clientes." },
    { t: "Optimización en Google", d: "SEO local para que te encuentren quienes buscan tu servicio cerca." },
    { t: "Reservas y contacto", d: "Botón de WhatsApp, formularios, mapa, menú o catálogo. Lo que necesites." },
    { t: "Móvil primero", d: "Más del 70% te visitará desde el móvil. Se ve perfecta en cualquier pantalla." },
    { t: "Rápida y segura", d: "Carga en menos de 2 segundos, con certificado HTTPS incluido." },
    { t: "Mantenimiento", d: "Nos ocupamos de cambios, copias y actualizaciones. Tú, de tu negocio." },
  ];
  return (
    <section id="servicios" className="bg-sand/50">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Todo lo que tu web necesita
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.t} className="rounded-2xl border border-line bg-white p-6 shadow-soft transition hover:shadow-lift">
              <h3 className="font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-ink-600">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Hablamos", d: "Una charla de 20 minutos para entender tu negocio y qué quieres conseguir." },
    { n: "02", t: "Diseñamos", d: "Te presentamos una propuesta visual única. Ajustamos hasta que te enamore." },
    { n: "03", t: "Publicamos", d: "Montamos la web, la conectamos a tu dominio y la lanzamos a Google." },
    { n: "04", t: "Cuidamos", d: "Seguimos contigo: cambios, mejoras y soporte cuando lo necesites." },
  ];
  return (
    <section id="proceso" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
        Sencillo de principio a fin
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-line bg-white p-6 shadow-soft">
            <span className="font-display text-4xl font-semibold text-terracotta-500/30">{s.n}</span>
            <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
            <p className="mt-2 text-ink-600">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Showcase() {
  const demos = [
    { t: "El Rincón de Ana", k: "Restaurante", c: "from-amber-400 to-terracotta-600" },
    { t: "Studio Marta", k: "Peluquería", c: "from-pink-400 to-rose-600" },
    { t: "Taller Hnos. Ruiz", k: "Mecánica", c: "from-slate-500 to-slate-800" },
  ];
  return (
    <section id="ejemplos" className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Cada web, una historia distinta
        </h2>
        <p className="mt-3 max-w-xl text-paper/70">
          Ejemplos del estilo que creamos. Diseños propios, adaptados a cada sector.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {demos.map((d) => (
            <div key={d.t} className="overflow-hidden rounded-2xl bg-ink-800">
              <div className={`h-44 bg-gradient-to-br ${d.c}`} />
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-paper/50">{d.k}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">{d.t}</h3>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-paper/50">
          * Ejemplos ilustrativos. Sustitúyelos por tus proyectos reales cuando los tengas.
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      t: "Esencial",
      p: "desde 390€",
      d: "Para empezar a estar online ya.",
      f: ["Web de una página", "Diseño a medida", "Móvil + Google", "Botón de WhatsApp"],
      featured: false,
    },
    {
      t: "Profesional",
      p: "desde 690€",
      d: "La opción que elige la mayoría.",
      f: ["Hasta 5 páginas", "SEO local", "Formularios y reservas", "Galería / catálogo", "1 mes de soporte"],
      featured: true,
    },
    {
      t: "A medida",
      p: "hablemos",
      d: "Proyectos con tienda o necesidades especiales.",
      f: ["Tienda online", "Reservas avanzadas", "Integraciones", "Soporte continuo"],
      featured: false,
    },
  ];
  return (
    <section id="precios" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Precios claros</h2>
      <p className="mt-3 text-ink-600">Sin sorpresas. Te pasamos presupuesto cerrado antes de empezar.</p>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((pl) => (
          <div
            key={pl.t}
            className={`rounded-2xl border p-7 ${
              pl.featured
                ? "border-terracotta-500 bg-white shadow-lift ring-1 ring-terracotta-500"
                : "border-line bg-white shadow-soft"
            }`}
          >
            {pl.featured && (
              <span className="mb-3 inline-block rounded-full bg-terracotta-500 px-3 py-1 text-xs font-medium text-white">
                Más popular
              </span>
            )}
            <h3 className="font-display text-xl font-semibold">{pl.t}</h3>
            <p className="mt-1 font-display text-3xl font-semibold text-terracotta-600">{pl.p}</p>
            <p className="mt-1 text-sm text-ink-600">{pl.d}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink-600">
              {pl.f.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-pine-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contacto"
              className={`mt-6 block rounded-full px-5 py-2.5 text-center text-sm font-medium transition ${
                pl.featured
                  ? "bg-terracotta-500 text-white hover:bg-terracotta-600"
                  : "bg-sand text-ink hover:bg-line"
              }`}
            >
              Empezar
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    { q: "¿Cuánto tarda mi web?", a: "Entre 1 y 3 semanas según el tamaño, una vez tenemos tus textos e imágenes." },
    { q: "¿Necesito tener dominio?", a: "No hace falta. Si no tienes, te ayudamos a registrar tu .es o .com." },
    { q: "¿Y si no tengo fotos buenas?", a: "Te orientamos para conseguirlas o usamos recursos de calidad mientras tanto." },
    { q: "¿Puedo editar la web yo mismo?", a: "Sí, podemos montarla para que hagas cambios fáciles, o nos encargamos nosotros." },
  ];
  return (
    <section className="bg-sand/50">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Preguntas frecuentes</h2>
        <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {f.q}
                <span className="text-terracotta-500 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-ink-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-4xl px-5 py-20">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Cuéntanos tu negocio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-600">
          Rellena el formulario y te escribimos en menos de 24 h con ideas concretas.
          Sin compromiso y sin tecnicismos.
        </p>
      </div>
      <div className="mt-10">
        <ContactForm />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-ink-600 sm:flex-row">
        <div>
          <p className="font-display text-base font-semibold text-ink">
            {BRAND}
            <span className="text-terracotta-500">.</span>
          </p>
          <p className="mt-1">{BRAND_TAGLINE}</p>
        </div>
        <div className="text-center sm:text-right">
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
            {CONTACT_EMAIL}
          </a>
          <p className="mt-1 text-ink-400">
            © {new Date().getFullYear()} {BRAND} · Hecho en España 🇪🇸
          </p>
        </div>
      </div>
    </footer>
  );
}
