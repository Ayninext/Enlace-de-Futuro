import Link from "next/link";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col">
      {/* Encabezado / Nuestra historia */}
      <section className="border-b border-line bg-surface-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-brand hover:underline"
          >
            ← Volver al inicio
          </Link>

          <span className="mt-6 block w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#8A6508]">
            Nuestra historia
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Conoce más sobre <span className="text-brand">Enlace de Futuro</span>
          </h1>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/75 sm:text-base">
            <p>
              Cuando empezamos a mirar cómo los jóvenes buscan oportunidades para crecer, notamos
              un patrón que se repite una y otra vez, la información valiosa está súper dispersa.
              Una beca aparece en una publicación perdida, un buen curso o programa se anuncia en
              una historia que dura veinticuatro horas, una convocatoria interesante queda enterrada
              entre decenas de páginas o los requisitos están redactados de forma confusa. Muchas
              veces no es falta de ganas ni de talento de los jóvenes, sino que encontrar la
              información clara y a tiempo depende casi de casualidad.
            </p>
            <p>
              Enlace de Futuro nació justamente para cambiar esa dinámica, quisimos construir un
              espacio donde lo importante esté reunido, ordenado y explicado sin rodeos, para que
              descubrir una beca, un empleo, un curso, una convocatoria o un concurso no se sienta
              como buscar una aguja en un pajar. La idea detrás del proyecto es simple pero potente,
              dar el siguiente paso en la formación o en la vida profesional debería ser más
              accesible para cualquier joven que esté buscando avanzar.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-14 sm:px-6 space-y-16">
        {/* Nuestros pilares */}
        <section aria-labelledby="pilares-heading">
          <h2 id="pilares-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Nuestros pilares
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-base">
            En Enlace de Futuro no subimos convocatorias al azar ni llenamos el espacio con ruido,
            cada oportunidad pasa por un proceso de revisión antes de aparecer en la plataforma para
            asegurarnos de que realmente valga la pena y que la información sea confiable.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <article className="rounded-2xl border border-line bg-surface-muted p-6">
              <h3 className="text-base font-bold text-ink">Curaduría y verificación</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Revisamos la fuente de cada convocatoria, confirmamos que esté vigente y verificamos
                los datos clave antes de publicarla, evitando enlaces rotos, información dudosa o
                anuncios engañosos.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface-muted p-6">
              <h3 className="text-base font-bold text-ink">Requisitos claros y enlace directo</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Sabemos lo frustrante que es entrar a una convocatoria y no saber qué piden o dónde
                postular exactamente. Por eso organizamos los requisitos principales de cada curso,
                programa, beca u oportunidad y colocamos el enlace directo para que puedas revisar
                las bases oficiales y postular sin perder tiempo.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface-muted p-6">
              <h3 className="text-base font-bold text-ink">100% gratuito y pensado para jóvenes</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Acceder a la información que publicamos no tiene ningún costo, todo está pensado
                desde la realidad y las necesidades de los jóvenes que están empezando, estudiando,
                buscando experiencia o queriendo dar un giro a su camino profesional.
              </p>
            </article>
          </div>
        </section>

        {/* Nuestros valores */}
        <section aria-labelledby="valores-heading" className="border-t border-line pt-14">
          <h2 id="valores-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Nuestros valores
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <article className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="text-base font-bold text-brand">Transparencia</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Mostramos la información de forma clara y honesta, con lo que se necesita saber de
                cada oportunidad y llevando siempre a los canales oficiales correspondientes, sin
                promesas falsas ni letra pequeña escondida.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="text-base font-bold text-brand">Accesibilidad</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Buscamos que cualquier joven pueda entender qué ofrece una convocatoria y cómo
                postular sin necesitar traducir tecnicismos ni recorrer diez pestañas distintas.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="text-base font-bold text-brand">Impacto juvenil</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Cada decisión del proyecto gira en torno a sumar valor real en la etapa en la que más
                se abren puertas: cuando estás definiendo tu rumbo académico, buscando tu primera
                experiencia o queriendo formarte en nuevas habilidades.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="text-base font-bold text-brand">Actualización constante</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Las fechas cierran rápido y las oportunidades cambian todo el tiempo, por lo que
                mantenemos la revisión continua para que veas opciones activas y vigentes.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface p-6 sm:col-span-2">
              <h3 className="text-base font-bold text-brand">Impacto con los ODS</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Conectamos nuestro trabajo con los Objetivos de Desarrollo Sostenible, especialmente
                impulsando una educación de calidad, el trabajo decente y el crecimiento económico, y
                la reducción de desigualdades al acercar oportunidades a más jóvenes.
              </p>
            </article>
          </div>
        </section>

        {/* Preguntas frecuentes (FAQ) */}
        <section aria-labelledby="faq-heading" className="border-t border-line pt-14">
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Preguntas frecuentes (FAQ)
          </h2>

          <div className="mt-6 space-y-4">
            <article className="rounded-2xl border border-line bg-surface-muted p-6">
              <h3 className="text-base font-bold text-ink">
                ¿Tiene algún costo usar Enlace de Futuro?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                No, explorar la plataforma y revisar las oportunidades es completamente gratuito,
                nuestro objetivo es facilitar el acceso a información útil sin poner barreras
                económicas.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface-muted p-6">
              <h3 className="text-base font-bold text-ink">
                ¿Cómo postulo a una beca, curso, programa o empleo?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Dentro de cada oportunidad encontrarás un resumen de la información, los requisitos
                principales y el enlace oficial. Desde ahí puedes ir directamente a la fuente
                organizadora para completar tu postulación siguiendo sus indicaciones.
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface-muted p-6">
              <h3 className="text-base font-bold text-ink">
                ¿Cómo puedo sugerir una convocatoria o contactar al equipo?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Si conoces alguna oportunidad que creas que le puede servir a otros jóvenes o quieres
                escribirnos con alguna consulta, todo el contacto se maneja directamente a través de
                nuestro Instagram oficial:{" "}
                <a
                  href="https://www.instagram.com/enlace.de.futuro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand hover:underline"
                >
                  @enlace.de.futuro
                </a>
                .
              </p>
            </article>

            <article className="rounded-2xl border border-line bg-surface-muted p-6">
              <h3 className="text-base font-bold text-ink">
                ¿Se pueden hacer alianzas con otras organizaciones?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                ¡Sí! Estamos abiertos a formar alianzas con organizaciones, colectivos,
                instituciones o iniciativas que compartan el propósito de impulsar a los jóvenes, si
                quieres proponer una alianza o difundir alguna iniciativa en conjunto, escríbenos
                por mensaje directo a{" "}
                <a
                  href="https://www.instagram.com/enlace.de.futuro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand hover:underline"
                >
                  @enlace.de.futuro
                </a>
                .
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* Pie de página */}
      <footer className="border-t border-line bg-surface-muted py-10 px-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-ink/50">
            © 2026 Enlace de Futuro. Todos los derechos reservados.
          </p>
          <a
            href="https://www.instagram.com/enlace.de.futuro/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand hover:underline"
          >
            Instagram: @enlace.de.futuro
          </a>
        </div>
      </footer>
    </div>
  );
}
