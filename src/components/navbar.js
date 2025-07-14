import { navigate } from "../router.js";
import userDefaultImg from "../assets/images/user.png";
import "../assets/styles/navbar.css";

export default function navbar(header) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "true");
  const isLoggedIn = !!user;

  let authLinks = "";
  if (isLoggedIn) {
    authLinks = `
      <li><a href="/workshops" data-link>My workshops</a></li>
      <!-- Avatar y dropdown para desktop -->
      <li class="navbar__avatar-container">
        <button class="navbar__avatar-button" aria-label="User menu">
          <span class="navbar__avatar-circle"></span>
        </button>
        <ul class="navbar__dropdown">
          <li><a href="/profile" data-link>Profile</a></li>
          <li><a href="#" id="logout-link">Logout</a></li>
        </ul>
      </li>
      <!-- Profile y Logout como li normales para mobile/burger abierto -->
      <li class="navbar__profile-link"><a href="/profile" data-link>Profile</a></li>
      <li class="navbar__logout-link"><a href="#" id="logout-link-mobile">Logout</a></li>
    `;
  } else {
    authLinks = `
      <li><a href="/login" data-link>Login</a></li>
      <li><a href="/signup" data-link>Signup</a></li>
    `;
  }

  header.innerHTML = `
  <nav class="navbar">
    <div class="navbar__brand">
        <a href="/home" data-link class="navbar__logo">Workshop Hub</a>
        <button class="navbar__toggle" aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
    </div>
    <ul class="navbar__links">
        <li><a href="/home" data-link>Home</a></li>
        ${authLinks}
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
      img.src = user.avatarUrl || userDefaultImg;
      img.alt = "User avatar";
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
      navigate("/login");
    });
  }
  //Logout (mobile li)
  const logoutMobile = header.querySelector("#logout-link-mobile");
  if (logoutMobile) {
    logoutMobile.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("currentUser");
      navigate("/login");
    });
  }
}
