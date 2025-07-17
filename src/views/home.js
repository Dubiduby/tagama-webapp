import "../assets/styles/home.css";

import { renderWorkshops } from "../utils/renderCards.js";
import {
  getCachedWorkshops,
  getCachedCategories,
  getCachedSubcategories,
} from "../utils/cache.js";
import { workshopCards } from "../components/cards.js";

export default async function home(container) {
  const workshops = await getCachedWorkshops();
  const categories = await getCachedCategories();
  const subcategories = await getCachedSubcategories();
  
  


  renderWorkshops(container, workshops, categories, subcategories);
 
  

}
