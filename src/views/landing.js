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
        <div class="flex items-center gap-2 text-[var(--color-text)] font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg><span>Por toda la isla</span></div>
        <div class="hidden md:block w-px h-6 bg-[var(--color-border)]"></div>
        <div class="flex items-center gap-2 text-[var(--color-text)] font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg><span>Comunidad creciente</span></div>
      </div>
      <div class="flex flex-col gap-4 mb-6 justify-center md:flex-row">
        <a href="/login" data-link class="text-lg px-8 py-3 rounded-full bg-dark-orange cursor-pointer text-white font-bold shadow hover:bg-[var(--color-hover)] hover:text-white focus:outline-2 focus:outline-[#2563eb] transition">Descubrir talleres <span class='inline-block align-middle'><ArrowRight /></span></a>
        <a href="/landing" data-link class="text-lg px-8 py-3 rounded-full border-2 border-dark-orange bg-[var(--color-bg)] text-dark-orange font-bold hover:bg-dark-orange hover:text-white focus:outline-2 focus:outline-[#2563eb] transition">Como funciona</a>
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
        <div class="text-3xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg></div>
        <h3 class="text-dark-orange font-bold mt-2 mb-1">Comunidad</h3>
        <p class="text-[var(--color-title)] text-base">Encuentros reales con personas afines que comparten tu pasión por crear y aprender.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center">
        <div class="text-3xl mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake-icon lucide-heart-handshake"><path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"/></svg>
        </div>
        <h3 class="text-dark-orange font-bold mt-2 mb-1">Cercanía</h3>
        <p class="text-[var(--color-title)] text-base">Un proyecto local, hecho con mimo, que celebra el talento y la creatividad de Tenerife.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center">
        <div class="text-3xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg></div>
        <h3 class="text-dark-orange font-bold mt-2 mb-1">Creatividad</h3>
        <p class="text-[var(--color-title)] text-base">Talleres variados para explorar nuevas habilidades y despertar tu lado más artístico.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center">
        <div class="text-3xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big-icon lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg></div>
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
        <div class="text-2xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        </div>
        <h3 class="text-[var(--color-text)] font-bold mt-2 mb-1">Explora</h3>
        <p class="text-[var(--color-title)] text-base">Navega por talleres únicos organizados por artistas locales de Tenerife.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center min-w-[220px] flex-1">
        <div class="text-xl font-bold text-dark-orange mb-2">2</div>
        <div class="text-2xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ticket-check-icon lucide-ticket-check"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="m9 12 2 2 4-4"/></svg></div>
        <h3 class="text-[var(--color-text)] font-bold mt-2 mb-1">Inscríbete</h3>
        <p class="text-[var(--color-title)] text-base">Encuentra el horario perfecto e inscribete al taller de forma sencilla.</p>
      </div>
      <div class="bg-[var(--color-bg)] rounded-xl p-8 shadow text-center min-w-[220px] flex-1">
        <div class="text-xl font-bold text-dark-orange mb-2">3</div>
        <div class="text-2xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-component-icon lucide-component"><path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/><path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"/><path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"/><path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/></svg></div>
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
      <a href="/login" data-link class="bg-white text-dark-orange border-2 border-white text-lg px-8 py-3 rounded-full font-bold hover:bg-[var(--color-title)] hover:text-white hover:border-[var(--color-title)] focus:outline-2 focus:outline-[#2563eb] transition">Explorar talleres →</a>
    </div>
    <p class="text-white text-shadow mt-2">Sin compromisos • Gratis para empezar</p>
  </div>
</section>
`;
}
