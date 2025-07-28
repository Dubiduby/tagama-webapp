import "../assets/styles/landing.css";

export default async function landing(container) {
  container.innerHTML = "";
  container.innerHTML = `
<section class="landing-hero">
  <div class="landing-hero__container">
    <div class="landing-hero__content-col">
      <div class="landing-hero__logo"><Logo size="lg" /></div>
      <h1 class="landing-hero__title">
        La agenda creativa de
        <span class="landing-hero__title-highlight">Tenerife</span>
      </h1>
      <p class="landing-hero__subtitle">
        Descubre talleres únicos cerca de ti. Conecta con artistas locales, 
        aprende nuevas habilidades y forma parte de nuestra comunidad creativa.
      </p>
      <div class="landing-hero__features">
        <div class="landing-hero__feature"><MapPin /><span>Por toda la isla</span></div>
        <div class="landing-hero__feature"></div>
        <div class="landing-hero__feature"><Users /><span>Comunidad creciente</span></div>
      </div>
      <div class="landing-hero__actions">
        <Button class="landing-hero__btn" size="lg">Descubrir talleres<ArrowRight /></Button>
        <Button class="landing-hero__btn landing-hero__btn--outline" variant="outline" size="lg">Crear mi taller</Button>
      </div>
      <p class="landing-hero__note">Desde cerámica hasta fotografía, teatro y cocina creativa</p>
    </div>
  </div>
</section>
<section class="landing-values" id="comunidad">
  <div class="landing-values__container">
    <div class="landing-values__header">
      <h2 class="landing-values__title">Nuestros valores</h2>
      <p class="landing-values__desc">Más que una plataforma, somos una comunidad que celebra la creatividad y el encuentro entre personas.</p>
    </div>
    <div class="landing-values__grid">
      <div class="landing-values__item">
        <div class="landing-values__icon">[Icono Comunidad]</div>
        <h3 class="landing-values__item-title">Comunidad</h3>
        <p class="landing-values__item-desc">Encuentros reales con personas afines que comparten tu pasión por crear y aprender.</p>
      </div>
      <div class="landing-values__item">
        <div class="landing-values__icon">[Icono Cercanía]</div>
        <h3 class="landing-values__item-title">Cercanía</h3>
        <p class="landing-values__item-desc">Un proyecto local, hecho con mimo, que celebra el talento y la creatividad de Tenerife.</p>
      </div>
      <div class="landing-values__item">
        <div class="landing-values__icon">[Icono Creatividad]</div>
        <h3 class="landing-values__item-title">Creatividad</h3>
        <p class="landing-values__item-desc">Talleres variados para explorar nuevas habilidades y despertar tu lado más artístico.</p>
      </div>
      <div class="landing-values__item">
        <div class="landing-values__icon">[Icono Accesibilidad]</div>
        <h3 class="landing-values__item-title">Accesibilidad</h3>
        <p class="landing-values__item-desc">Para todo tipo de personas y presupuestos. Porque la creatividad no tiene límites.</p>
      </div>
    </div>
  </div>
</section>
<section class="landing-steps" id="como-funciona">
  <div class="landing-steps__container">
    <div class="landing-steps__header">
      <h2 class="landing-steps__title">¿Cómo funciona?</h2>
      <p class="landing-steps__desc">En tres simples pasos conectamos tu creatividad con la comunidad artística de Tenerife.</p>
    </div>
    <div class="landing-steps__grid">
      <div class="landing-steps__item">
        <div class="landing-steps__number">1</div>
        <div class="landing-steps__icon">[Icono Explora]</div>
        <h3 class="landing-steps__item-title">Explora</h3>
        <p class="landing-steps__item-desc">Navega por talleres únicos organizados por artistas locales de Tenerife.</p>
      </div>
      <div class="landing-steps__item">
        <div class="landing-steps__number">2</div>
        <div class="landing-steps__icon">[Icono Reserva]</div>
        <h3 class="landing-steps__item-title">Reserva</h3>
        <p class="landing-steps__item-desc">Encuentra el horario perfecto y reserva tu plaza de forma sencilla.</p>
      </div>
      <div class="landing-steps__item">
        <div class="landing-steps__number">3</div>
        <div class="landing-steps__icon">[Icono Conecta]</div>
        <h3 class="landing-steps__item-title">Conecta</h3>
        <p class="landing-steps__item-desc">Disfruta de la experiencia y conecta con personas que comparten tus intereses.</p>
      </div>
    </div>
    <div class="landing-steps__info">
      <p>¿Eres artista o instructor? También puedes <a class="landing-steps__link" href="#">crear y gestionar tus propios talleres</a></p>
    </div>
  </div>
</section>
<section class="landing-cta">
  <div class="landing-cta__bg">
    <div class="landing-cta__bg-shape"></div>
    <div class="landing-cta__bg-shape"></div>
    <div class="landing-cta__bg-shape"></div>
  </div>
  <div class="landing-cta__content">
    <div class="landing-cta__icon">✨</div>
    <h2 class="landing-cta__title">¿Listo para despertar tu creatividad?</h2>
    <p class="landing-cta__desc">Únete a nuestra comunidad de artistas y creadores. Descubre talleres únicos, conecta con personas afines y forma parte del movimiento creativo de Tenerife.</p>
    <div class="landing-cta__actions">
      <button class="landing-cta__btn">Explorar talleres →</button>
      <button class="landing-cta__btn landing-cta__btn--outline">Crear mi primer taller</button>
    </div>
    <p class="landing-cta__note">Sin compromisos • Gratis para empezar</p>
  </div>
</section>
`;
}
