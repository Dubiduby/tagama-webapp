import { router } from "./router.js";
import { handleLinks } from "./router.js";
import "./assets/styles/general.css";
import "./assets/styles/modal.css";
import './assets/styles/main.css';

//para que se cargue todo el html antes de redireccionar
document.addEventListener("DOMContentLoaded", () => {
  router();
  handleLinks();
});

//¿Qué hace router?
//Lee la URL actual (window.location.pathname).
//Busca en el objeto routes la vista correspondiente.
//Carga dinámicamente el módulo de esa vista y lo renderiza dentro del <div id="app"></div>.
//Si la ruta no existe, carga la vista de "not found".
