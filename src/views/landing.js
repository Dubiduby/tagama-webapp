export default async function landing(container) {
  container.innerHTML = "";
  container.innerHTML = `
<section class="py-12">
  <div class="max-w-5xl mx-auto flex flex-col items-center px-4">
    <div class="flex flex-col items-center text-center w-full">
      <div class="mb-6"><Logo size="lg" /></div>
      <h1 class="text-4xl md:text-5xl font-extrabold text-[var(--color-title)] mb-4">
        La agenda creativa de
        <span class="text-dark-orange font-black">Tenerife</span>
      </h1>
      <p class="text-lg text-[var(--color-text)] mb-8">
        Descubre talleres únicos cerca de ti. Conecta con artistas locales, 
        aprende nuevas habilidades y forma parte de nuestra comunidad creativa.
      </p>
      <div class="flex gap-8 items-center justify-center mb-6 flex-wrap">
        <div class="flex items-center gap-2 text-[var(--color-text)] font-semibold"><MapPin /><span>Por toda la isla</span></div>
        <div class="hidden md:block w-px h-6 bg-[var(--color-border)]"></div>
        <div class="flex items-center gap-2 text-[var(--color-text)] font-semibold"><Users /><span>Comunidad creciente</span></div>
      </div>
      <div class="flex gap-4 mb-6 justify-center">
        <button class="text-lg px-8 py-3 rounded-full bg-dark-orange text-white font-bold shadow hover:bg-[var(--color-hover)] hover:text-white focus:outline-2 focus:outline-[#2563eb] transition">Descubrir talleres <span class='inline-block align-middle'><ArrowRight /></span></button>
        <button class="text-lg px-8 py-3 rounded-full border-2 border-dark-orange bg-[var(--color-bg)] text-dark-orange font-bold hover:bg-dark-orange hover:text-white focus:outline-2 focus:outline-[#2563eb] transition">Crear mi taller</button>
      </div>
      <p class="text-[var(--color-text)] text-base mt-2">Desde cerámica hasta fotografía, teatro y cocina creativa</p>
    </div>
  </div>
</section>

<section class="bg-[var(--color-2bg)] rounded-3xl shadow-lg max-w-5xl mx-auto my-8 p-10">
  <div>
    <div class="text-center mb-8">
      <h2 class="text-dark-orange text-3xl font-bold mb-2">Nuestros valores</h2>
      <p class="text-[var(--color-text)]">Más que una plataforma, somos una comunidad que celebra la creatividad y el encuentro entre personas.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center">
        <div class="text-3xl mb-2">[Icono Comunidad]</div>
        <h3 class="text-dark-orange font-bold mt-2 mb-1">Comunidad</h3>
        <p class="text-[var(--color-title)] text-base">Encuentros reales con personas afines que comparten tu pasión por crear y aprender.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center">
        <div class="text-3xl mb-2">[Icono Cercanía]</div>
        <h3 class="text-dark-orange font-bold mt-2 mb-1">Cercanía</h3>
        <p class="text-[var(--color-title)] text-base">Un proyecto local, hecho con mimo, que celebra el talento y la creatividad de Tenerife.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center">
        <div class="text-3xl mb-2">[Icono Creatividad]</div>
        <h3 class="text-dark-orange font-bold mt-2 mb-1">Creatividad</h3>
        <p class="text-[var(--color-title)] text-base">Talleres variados para explorar nuevas habilidades y despertar tu lado más artístico.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center">
        <div class="text-3xl mb-2">[Icono Accesibilidad]</div>
        <h3 class="text-dark-orange font-bold mt-2 mb-1">Accesibilidad</h3>
        <p class="text-[var(--color-title)] text-base">Para todo tipo de personas y presupuestos. Porque la creatividad no tiene límites.</p>
      </div>
    </div>
  </div>
</section>

<section class="max-w-5xl mx-auto my-8 p-10">
  <div>
    <div class="text-center mb-8">
      <h2 class="text-dark-orange text-3xl font-bold mb-2">¿Cómo funciona?</h2>
      <p class="text-[var(--color-text)]">En tres simples pasos conectamos tu creatividad con la comunidad artística de Tenerife.</p>
    </div>
    <div class="flex flex-wrap gap-8 justify-center mt-8">
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center min-w-[220px] flex-1">
        <div class="text-xl font-bold text-dark-orange mb-2">1</div>
        <div class="text-2xl mb-2">[Icono Explora]</div>
        <h3 class="text-[var(--color-text)] font-bold mt-2 mb-1">Explora</h3>
        <p class="text-[var(--color-title)] text-base">Navega por talleres únicos organizados por artistas locales de Tenerife.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center min-w-[220px] flex-1">
        <div class="text-xl font-bold text-dark-orange mb-2">2</div>
        <div class="text-2xl mb-2">[Icono Reserva]</div>
        <h3 class="text-[var(--color-text)] font-bold mt-2 mb-1">Reserva</h3>
        <p class="text-[var(--color-title)] text-base">Encuentra el horario perfecto y reserva tu plaza de forma sencilla.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center min-w-[220px] flex-1">
        <div class="text-xl font-bold text-dark-orange mb-2">3</div>
        <div class="text-2xl mb-2">[Icono Conecta]</div>
        <h3 class="text-[var(--color-text)] font-bold mt-2 mb-1">Conecta</h3>
        <p class="text-[var(--color-title)] text-base">Disfruta de la experiencia y conecta con personas que comparten tus intereses.</p>
      </div>
    </div>
    <div class="text-center mt-8">
      <p>¿Eres artista o instructor? También puedes 
        <a class="text-[#2563eb] underline hover:bg-[var(--color-border)] focus:outline-2 focus:outline-[#2563eb]" href="#">
          crear y gestionar tus propios talleres
        </a>
      </p>
    </div>
  </div>
</section>

<section class="bg-gradient-to-r from-dark-orange to-[var(--color-text)] text-white rounded-3xl p-12 text-center max-w-5xl mx-auto my-8 relative overflow-hidden">
  <div class="absolute top-0 left-0 right-0 bottom-0 z-0 pointer-events-none">
    <div class="w-32 h-32 rounded-full bg-white/10 absolute top-[10%] left-[10%] animate-[float_6s_infinite_alternate]"></div>
    <div class="w-20 h-20 rounded-full bg-white/10 absolute top-[60%] left-[70%] animate-[float_6s_infinite_alternate_2s]"></div>
    <div class="w-24 h-24 rounded-full bg-white/10 absolute top-[30%] left-[50%] animate-[float_6s_infinite_alternate_4s]"></div>
  </div>
  <div class="relative z-10">
    <div class="text-4xl mb-4">✨</div>
    <h2 class="text-3xl font-extrabold mb-4">¿Listo para despertar tu creatividad?</h2>
    <p class="text-lg mb-8">Únete a nuestra comunidad de artistas y creadores. Descubre talleres únicos, conecta con personas afines y forma parte del movimiento creativo de Tenerife.</p>
    <div class="flex justify-center gap-4 mb-6">
      <button class="bg-white text-dark-orange border-2 border-white text-lg px-8 py-3 rounded-full font-bold hover:bg-[var(--color-title)] hover:text-white hover:border-[var(--color-title)] focus:outline-2 focus:outline-[#2563eb] transition">Explorar talleres →</button>
      <button class="bg-transparent text-white border-2 border-white text-lg px-8 py-3 rounded-full font-bold hover:bg-[var(--color-title)] hover:text-white hover:border-[var(--color-title)] focus:outline-2 focus:outline-[#2563eb] transition">Crear mi primer taller</button>
    </div>
    <p class="text-white text-shadow mt-2">Sin compromisos • Gratis para empezar</p>
  </div>
</section>
`;
}
