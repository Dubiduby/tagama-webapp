import "../assets/styles/aboutUs.css";

export default function aboutUs(container) {
  // Limpiar el container
  container.innerHTML = "";

  // Crear contenedor principal
  const mainContainer = document.createElement("div");
  mainContainer.className = "about-container";

  // Título principal
  const title = document.createElement("h1");
  title.className = "about-title";
  title.textContent = "Sobre Tagama";
  mainContainer.appendChild(title);

  // Descripción principal
  const mainDescription = document.createElement("p");
  mainDescription.className = "about-main-desc";
  mainDescription.textContent = "Tagama es un espacio vivo donde personas creativas, curiosas y apasionadas se encuentran para aprender, compartir y reconectar con lo que les mueve.";
  mainContainer.appendChild(mainDescription);

  // Sección de origen
  const originSection = document.createElement("section");
  originSection.className = "about-section";

  const originTitle = document.createElement("h2");
  originTitle.className = "about-section-title";
  originTitle.textContent = "Nacimos en Tenerife con una idea muy simple:";
  originSection.appendChild(originTitle);

  const originText = document.createElement("p");
  originText.className = "about-origin-text";
  originText.innerHTML = "🌿 ¿Y si existiera un lugar donde descubrir todos los workshops que pasan cerca, sin tener que buscarlos por todas partes?<br>Así creamos Tagama: la agenda creativa de la isla.";
  originSection.appendChild(originText);
  mainContainer.appendChild(originSection);

  // Sección "Qué queremos"
  const goalsSection = document.createElement("section");
  goalsSection.className = "about-section";

  const goalsTitle = document.createElement("h2");
  goalsTitle.className = "about-section-title";
  goalsTitle.textContent = "Qué queremos";
  goalsSection.appendChild(goalsTitle);

  const goalsList = document.createElement("ul");
  goalsList.className = "about-goals-list";

  const goals = [
    "Que más personas puedan dedicarse tiempo.",
    "Que encuentren esa actividad que siempre han querido probar.",
    "Que se animen a compartir lo que saben con otras personas.",
    "Y que todo eso ocurra en comunidad, desde lo local y con sentido."
  ];

  goals.forEach(goal => {
    const listItem = document.createElement("li");
    listItem.textContent = goal;
    goalsList.appendChild(listItem);
  });

  goalsSection.appendChild(goalsList);
  mainContainer.appendChild(goalsSection);

  // Sección "Lo que creemos"
  const beliefsSection = document.createElement("section");
  beliefsSection.className = "about-section";

  const beliefsTitle = document.createElement("h2");
  beliefsTitle.className = "about-section-title";
  beliefsTitle.textContent = "Lo que creemos";
  beliefsSection.appendChild(beliefsTitle);

  const beliefsList = document.createElement("ul");
  beliefsList.className = "about-beliefs-list";

  const beliefs = [
    "Que la creatividad está en todas partes (aunque a veces se nos olvide).",
    "Que aprender algo nuevo es una forma de cuidarse.",
    "Que cuando las personas se juntan a hacer cosas, pasan cosas.",
    "Que lo local importa. Y que merece su espacio."
  ];

  beliefs.forEach(belief => {
    const listItem = document.createElement("li");
    listItem.textContent = belief;
    beliefsList.appendChild(listItem);
  });

  beliefsSection.appendChild(beliefsList);
  mainContainer.appendChild(beliefsSection);

  // Sección "¿Por qué Tagama?"
  const nameSection = document.createElement("section");
  nameSection.className = "about-section";

  const nameTitle = document.createElement("h2");
  nameTitle.className = "about-section-title";
  nameTitle.textContent = "¿Por qué \"Tagama\"?";
  nameSection.appendChild(nameTitle);

  const nameDescription = document.createElement("p");
  nameDescription.className = "about-name-desc";
  nameDescription.innerHTML = "El nombre viene de una fusión entre dos palabras de origen guanche:<br><strong>Tagoror</strong>, un espacio de encuentro y diálogo.<br><strong>Agama</strong>, que evoca la naturaleza.";
  nameSection.appendChild(nameDescription);

  const nameConclusion = document.createElement("p");
  nameConclusion.className = "about-name-conclusion";
  nameConclusion.textContent = "Tagama es eso: un punto de encuentro entre personas, saberes y la tierra. Un recordatorio de que nunca es tarde para reconectar con lo que te gusta y empezar a hacerlo.";
  nameSection.appendChild(nameConclusion);

  mainContainer.appendChild(nameSection);

  // Agregar al container principal
  container.appendChild(mainContainer);
} 