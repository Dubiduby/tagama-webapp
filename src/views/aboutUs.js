export default function aboutUs(container) {
  container.innerHTML = `
    <section class="max-w-5xl mx-auto text-base text-gray-800 dark:text-gray-100">
      <div class="space-y-16 pt-6 px-4">

        <!-- Título y descripción -->
        <header class="text-center">
          <h1 class="text-4xl font-semibold text-[color:#9B5D44] dark:text-light-orange">Sobre Tagama</h1>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tagama es un espacio vivo donde personas creativas, curiosas y apasionadas se encuentran para aprender, compartir y reconectar con lo que les mueve.
          </p>
        </header>

        <!-- Idea fundacional -->
        <section class="text-center space-y-4 md:pt-10">
          <h2 class="text-2xl font-semibold text-[color:#5F7365] dark:text-[color:#a5b6ab]">Nacimos en Tenerife con una idea muy simple:</h2>
          <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            ¿Y si existiera un lugar donde descubrir todos los workshops que pasan cerca, sin tener que buscarlos por todas partes?<br>
            Así creamos Tagama: la agenda creativa de la isla.
          </p>
        </section>

        <!-- Qué queremos / Lo que creemos -->
        <section class="grid md:grid-cols-2 gap-8 md:pb-14">
          <div class="bg-white dark:bg-[#2f2f2f] rounded-2xl shadow p-6 dark:border dark:border-dark-green">
            <h2 class="text-xl font-semibold text-[color:#5F7365] dark:text-[color:#a5b6ab] mb-4">Qué queremos</h2>
            <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Que más personas puedan dedicarse tiempo.</li>
              <li>Que encuentren esa actividad que siempre han querido probar.</li>
              <li>Que se animen a compartir lo que saben con otras personas.</li>
              <li>Y que todo eso ocurra en comunidad, desde lo local y con sentido.</li>
            </ul>
          </div>

          <div class="bg-white dark:bg-[#2f2f2f] rounded-2xl shadow p-6 dark:border dark:border-dark-green">
            <h2 class="text-xl font-semibold text-[color:#5F7365] dark:text-[color:#a5b6ab] mb-4">Lo que creemos</h2>
            <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Que la creatividad está en todas partes (aunque a veces se nos olvide).</li>
              <li>Que aprender algo nuevo es una forma de cuidarse.</li>
              <li>Que cuando las personas se juntan a hacer cosas, pasan cosas.</li>
              <li>Que lo local importa. Y que merece su espacio.</li>
            </ul>
          </div>
        </section>

       <!-- Por qué Tagama -->
<section class="text-center">
  <h2 class="text-2xl font-semibold text-[color:#5F7365] dark:text-[color:#a5b6ab]">¿Por qué “Tagama”?</h2>
  <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto pt-4">
    El nombre viene de una fusión entre dos palabras de origen guanche:
  </p>

  <div class="grid gap-12 sm:grid-cols-1 md:grid-cols-2 justify-center items-start max-w-4xl mx-auto">
    
    <!-- Tagoror -->
    <div class="flex flex-col items-center h-full">
      <div class="relative w-full aspect-[4/3]">
        <img src="${
          new URL("../assets/images/oneline-gathering.svg", import.meta.url)
            .href
        }" alt="Tagoror" class="block dark:hidden absolute inset-0 w-full h-full object-contain"/>
        <img src="${
          new URL(
            "../assets/images/oneline-gathering-white.svg",
            import.meta.url
          ).href
        }" alt="Tagoror dark" class="hidden dark:block absolute inset-0 w-full h-full object-contain"/>
      </div>
      <p class="text-gray-700 dark:text-gray-300 text-center mt-4">
        <strong class="text-dark-orange dark:text-light-orange text-2xl">Tagoror</strong><br>
        Un espacio de encuentro y diálogo.
      </p>
    </div>

    <!-- Agama -->
    <div class="flex flex-col items-center h-full">
      <div class="relative w-full aspect-[4/3]">
        <img src="${
          new URL("../assets/images/oneline-mountain.svg", import.meta.url).href
        }" alt="Agama" class="block dark:hidden absolute inset-0 w-full h-full object-contain"/>
        <img src="${
          new URL(
            "../assets/images/oneline-mountain-white.svg",
            import.meta.url
          ).href
        }" alt="Agama dark" class="hidden dark:block absolute inset-0 w-full h-full object-contain"/>
      </div>
      <p class="text-gray-700 dark:text-gray-300 text-center mt-4">
        <strong class="text-dark-orange dark:text-light-orange text-2xl">Agama</strong><br>
        Que evoca a la naturaleza.
      </p>
    </div>
  </div>

  <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto pt-20">
    Tagama es eso: un punto de encuentro entre personas, saberes y la tierra.<br>
    Un recordatorio de que nunca es tarde para reconectar con lo que te gusta y empezar a hacerlo.
  </p>
</section>


      </div>
    </section>
  `;
}
