import "../assets/styles/notFound.css";

export default function notFound(container) {
  container.innerHTML = `<h1>404 - Página no encontrada</h1>
  <h2>Volver <a href="/home" data-link/>Home</h2>`;
}
