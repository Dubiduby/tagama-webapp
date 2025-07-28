import "../assets/styles/main.css";

export function showSpinner(container) {
  container.innerHTML = `
    <div id="spinner-container">
    <div class="spinner"></div>
    <p class="spinner-text">Cargando...</p>
    </div>
    `;
}

export function hideSpinner(container) {
  const spinnerContainer = container.querySelector(".spinner");
  if (spinnerContainer) {
    document.querySelector(".spinner").style.display = "none";
    document.querySelector(".spinner-text").style.display = "none";
  }
}
