import { navigate } from "../router.js";
import userDefaultImg from "../assets/images/user.png";
import "../assets/styles/navbar.css";
import { clearCache } from "../utils/cache.js";

export default function navbar(header) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isLoggedIn = !!user;

  let authLinks = "";
  if (isLoggedIn) {
    authLinks = `
      <li><a href="/workshops" data-link>Mis talleres</a></li>

      <!-- Avatar y dropdown para desktop -->
      <li class="navbar__avatar-container">
        <button class="navbar__avatar-button" aria-label="Menú de usuario">
          <span class="navbar__avatar-circle"></span>
        </button>
        <ul class="navbar__dropdown">
          <li><a href="/profile" data-link>Perfil</a></li>
          <li><a href="#" id="logout-link">Cerrar sesión</a></li>
        </ul>
      </li>
      <!-- Profile y Logout como li normales para mobile/burger abierto -->
      <li class="navbar__profile-link"><a href="/profile" data-link>Perfil</a></li>
      <li class="navbar__logout-link"><a href="#" id="logout-link-mobile">Cerrar sesión</a></li>
      
    `;
  } else {
    authLinks = `

      <li><a href="/login" data-link>Iniciar sesión</a></li>
      <li><a href="/signup" data-link>Registrarse</a></li>
    `;
  }

  header.innerHTML = `
  <nav class="navbar">
    <div class="navbar__brand">
        <a href="${
          isLoggedIn ? "/home" : "/"
        }" data-link class="navbar__logo"><img src="${
    new URL(
      "../assets/images/logo/Tagama-light-background-horiz.svg",
      import.meta.url
    ).href
  }" alt="Añadido a la lista"></img></a>
  
        <button class="navbar__toggle" aria-label="Abrir menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
    </div>
    <ul class="navbar__links">
    
        <li><a href="${isLoggedIn ? "/home" : "/"}" data-link>Inicio</a></li>
        ${authLinks}
        <button id="toggle-dark" class="ml-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors" aria-label="Cambiar modo claro/oscuro">
  <span id="dark-icon">🌙</span>
  <span id="light-icon" class="hidden">☀️</span>
</button>
        
    </ul>
    
    
  </nav>
  `;

  //Burger menu
  const toggle = header.querySelector(".navbar__toggle");
  const links = header.querySelector(".navbar__links");
  toggle.addEventListener("click", () => {
    links.classList.toggle("navbar__links--open");
    toggle.classList.toggle("active");
  });

  //Close burger menu after click in links
  const navbarLinks = header.querySelector(".navbar__links");
  navbarLinks.addEventListener("click", (event) => {
    if (event.target.matches("a[data-link]")) {
      navbarLinks.classList.remove("navbar__links--open");
      toggle.classList.remove("active");
    }
  });

  //Add avatar image (safe)
  if (isLoggedIn) {
    const avatarCircle = header.querySelector(".navbar__avatar-circle");
    if (avatarCircle) {
      const img = document.createElement("img");
      img.src = user.avatarUrl;
      img.alt = "Avatar del usuario";
      img.className = "navbar__avatar";
      avatarCircle.appendChild(img);
    }
  }

  //Logout (desktop dropdown)
  const logout = header.querySelector("#logout-link");
  if (logout) {
    logout.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("currentUser");
      clearCache();
      navigate("/");
    });
  }
  //Logout (mobile li)
  const logoutMobile = header.querySelector("#logout-link-mobile");
  if (logoutMobile) {
    logoutMobile.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("currentUser");
      clearCache();
      navigate("/");
    });
  }

  const darkToggle = header.querySelector("#toggle-dark");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    // Opcional: guarda la preferencia en localStorage
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      darkToggle.querySelector("#light-icon").classList.add("hidden");
      darkToggle.querySelector("#dark-icon").classList.remove("hidden");
    } else {
      localStorage.setItem("theme", "light");
      darkToggle.querySelector("#light-icon").classList.remove("hidden");
      darkToggle.querySelector("#dark-icon").classList.add("hidden");
    }
  });
  // Al cargar, aplica la preferencia guardada
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    darkToggle.querySelector("#light-icon").classList.add("hidden");
    darkToggle.querySelector("#dark-icon").classList.remove("hidden");
  }
}
}
