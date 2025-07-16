import "../assets/styles/home.css";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
} from "../utils/cache.js";

export default function home(container) {
  //Dentro de esta función iría todo el contenido de home
  container.innerHTML = "This is the home page";
}
