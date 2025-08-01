import { router } from "./router.js";
import { handleLinks } from "./router.js";
import "./assets/styles/general.css";
import "./assets/styles/main.css";

document.addEventListener("DOMContentLoaded", () => {
  router();
  handleLinks();
});
