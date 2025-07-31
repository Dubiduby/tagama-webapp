import { navigate } from "../router.js";
import userDefaultImg from "../assets/images/user.png";
import { clearCache } from "../utils/cache.js";

export default function navbar(header) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isLoggedIn = !!user;

  const theme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkMode = theme === "dark" || (!theme && prefersDark);

  let authLinks = "";
  if (isLoggedIn) {
    authLinks = `
      <li><a href="/workshops" data-link class="hover:bg-dark-green/20 dark:hover:bg-dark-green/50 px-4 py-2 rounded transition dark:text-[var(--color-title)]">Mis talleres</a></li>
      <!-- Avatar y dropdown para desktop -->
      <li class="relative hidden md:flex items-center group">
        <button class="flex items-center focus:outline-none" aria-label="Menú de usuario">
          <span class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
            <img src="${
              user.avatarUrl || userDefaultImg
            }" alt="Avatar del usuario" class="w-full h-full object-cover block" />
          </span>
        </button>
        <ul class="absolute right-0 top-12 border bg-[var(--color-bg)] border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[140px] z-20 py-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition">
          <li><a href="/profile" data-link class="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-dark-green/20 dark:hover:bg-dark-green/50 rounded dark:text-[var(--color-text)]">Perfil</a></li>
          <li><a href="#" id="logout-link" class="block px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cerrar sesión</a></li>
        </ul>
      </li>
      <!-- Profile y Logout como li normales para mobile/burger abierto -->
      <li class="block md:hidden"><a href="/profile" data-link class="hover:bg-dark-green/20 dark:hover:bg-dark-green/50 px-4 py-2 rounded transition dark:text-[var(--color-title)]">Perfil</a></li>
      <li class="block md:hidden"><a href="#" id="logout-link-mobile" class="text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded transition">Cerrar sesión</a></li>
    `;
  } else {
    authLinks = `
      <li><a href="/about" data-link class="hover:bg-dark-green/20 dark:hover:bg-dark-green/50 px-4 py-2 rounded transition dark:text-[var(--color-title)]">Sobre nosotros</a></li>
      <li><a href="/login" data-link class="hover:bg-dark-green/20 dark:hover:bg-dark-green/50 px-4 py-2 rounded transition dark:text-[var(--color-title)]">Iniciar sesión</a></li>
      <li><a href="/signup" data-link class="hover:bg-dark-green/20 dark:hover:bg-dark-green/50 px-4 py-2 rounded transition dark:text-[var(--color-title)]">Registrarse</a></li>
    `;
  }

  header.innerHTML = `
    <nav class="relative flex justify-between opacity-[0.95] md:flex-row items-center fixed bg-[var(--color-2bg)] dark:bg-[var(--color-2bg)/30] border-b border-gray-200 dark:border-gray-800 px-4 py-2 z-50 w-full dark:backdrop-brightness-50 backdrop-blur-md">
    <div class="flex w-full md:w-auto items-center justify-between">
      <a href="${
        isLoggedIn ? "/home" : "/"
      }" data-link class="font-bold text-xl text-gray-900 dark:text-gray-100 flex items-center">
        <img src="${
          new URL(
            `../assets/images/logo/Tagama-light-background-horiz.svg`,
            import.meta.url
          ).href
        }" alt="Logo" class="max-w-[160px] h-auto object-contain block dark:hidden py-1" />
        <img src="${
          new URL(
            `../assets/images/logo/Tagama-dark-background-horiz.svg`,
            import.meta.url
          ).href
        }" alt="Logo" class="max-w-[160px] h-auto object-contain hidden dark:block py-1" />
      </a>
      <button id="navbar-toggle" class="md:hidden flex flex-col justify-center items-center w-10 h-10 relative group" aria-label="Abrir menú" aria-expanded="false" aria-controls="navbar-links">
        <span class="block w-7 h-0.5 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300 absolute top-2.5 left-1.5 group-[.active]:top-4 group-[.active]:rotate-45"></span>
        <span class="block w-7 h-0.5 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300 absolute top-4 left-1.5 group-[.active]:opacity-0"></span>
        <span class="block w-7 h-0.5 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300 absolute top-6 left-1.5 group-[.active]:top-4 group-[.active]:-rotate-45"></span>
      </button>
    </div>
    <ul id="navbar-links"
  class="absolute top-full gap-8 py-4 left-0 w-full flex-col md:flex-row md:flex hidden md:static md:w-auto md:ml-auto items-center mt-2 md:mt-0 gap-2 md:gap-4 text-center bg-[var(--color-2bg)] dark:bg-[var(--color-2bg)] md:bg-transparent md:dark:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-lg md:rounded-none shadow md:shadow-none py-2 md:py-0 z-40 ">

      <li>
        <a href="${
          isLoggedIn ? "/home" : "/"
        }" data-link class="hover:bg-dark-green/20 dark:hover:bg-dark-green/50 px-4 py-2 rounded transition dark:text-[var(--color-title)]">Inicio</a>
      </li>
      ${authLinks}
      <li>
        <button id="toggle-dark" class="ml-2 p-2 rounded text-gray-800 dark:text-gray-200 transition-colors" aria-label="Cambiar modo claro/oscuro">
          <svg id="dark-icon"xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
          <svg id="light-icon" class="hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </button>
      </li>
    </ul>
  </nav>


  `;

  // Burger menu toggle
  const toggle = header.querySelector("#navbar-toggle");
  const links = header.querySelector("#navbar-links");
  if (toggle) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("flex");
      links.classList.toggle("hidden");
      toggle.classList.toggle("active");
    });
  }

  // Close burger menu after click in links (mobile)
  links.addEventListener("click", (event) => {
    if (event.target.matches("a[data-link]")) {
      links.classList.remove("flex");
      links.classList.add("hidden");
      if (toggle) toggle.classList.remove("active");
    }
  });

  // Logout (desktop dropdown)
  const logout = header.querySelector("#logout-link");
  if (logout) {
    logout.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("currentUser");
      clearCache();
      navigate("/");
    });
  }
  // Logout (mobile li)
  const logoutMobile = header.querySelector("#logout-link-mobile");
  if (logoutMobile) {
    logoutMobile.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("currentUser");
      clearCache();
      navigate("/");
    });
  }

  // Dark mode toggle
  const darkToggle = header.querySelector("#toggle-dark");
  const darkIcon = darkToggle?.querySelector("#dark-icon");
  const lightIcon = darkToggle?.querySelector("#light-icon");

  if (darkToggle) {
    if (isDarkMode) {
      lightIcon.classList.add("hidden");
      darkIcon.classList.remove("hidden");
    } else {
      lightIcon.classList.remove("hidden");
      darkIcon.classList.add("hidden");
    }

    darkToggle.addEventListener("click", () => {
      const isNowDark = document.documentElement.classList.toggle("dark");
      if (isNowDark) {
        localStorage.setItem("theme", "dark");
        lightIcon.classList.add("hidden");
        darkIcon.classList.remove("hidden");
      } else {
        localStorage.setItem("theme", "light");
        lightIcon.classList.remove("hidden");
        darkIcon.classList.add("hidden");
      }
    });
  }
}
