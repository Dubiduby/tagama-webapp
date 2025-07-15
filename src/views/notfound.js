import "../assets/styles/notFound.css";

export default function notFound(container) {
  container.innerHTML = `<h1>404 - Page not found</h1>
  <h2>Comeback to <a href="/home" data-link/>Home</h2>`;
}
