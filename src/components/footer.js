import "../assets/styles/footer.css";

export default function footer(footerContainer) {
  // Limpiar el contenedor
  footerContainer.innerHTML = "";

  // Crear el footer
  const footerEl = document.createElement("footer");
  footerEl.className = "footer";

  // Texto copyright
  const copyright = document.createElement("span");
  copyright.textContent = "© 2024 Workshop Hub";

  // Enlace a Contact us
  const contactLink = document.createElement("a");
  contactLink.href = "/contact";
  contactLink.setAttribute("data-link", "");
  contactLink.className = "footer-contact-link";
  contactLink.textContent = "Contact us";

  // Añadir elementos al footer
  footerEl.appendChild(copyright);
  footerEl.appendChild(contactLink);
  footerContainer.appendChild(footerEl);
} 