export function showConfirmModal({
  message = "¿Estás seguro?",
  buttonText = "Confirmar",
  buttonColor = "green",
  onConfirm,
  onCancel,
}) {
  const modal = document.createElement("div");
  modal.classList.add("confirm-modal");

  const colorClass =
    buttonColor === "red"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-600 hover:bg-green-700";

  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-box">
      <button id="closeBtn" class="modal-close">✕</button>
      <div class="modal-message">${message}</div>
      <div class="modal-buttons">
        <button id="confirmBtn" class="${colorClass}">Sí, ${buttonText}</button>
      </div>
    </div>
  `;

  // Estilos embebidos
  const style = document.createElement("style");
  style.textContent = `
    .confirm-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-backdrop {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.4);
    }
    .modal-box {
      position: relative;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      z-index: 1001;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      max-width: 320px;
      width: 90%;
      text-align: center;
    }
    .modal-close {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #888;
    }
    .modal-close:hover {
      color: #000;
    }
    .modal-message {
      color: #333;
      font-size: 1rem;
      line-height: 1.5;
      margin-top: 0.5rem;
    }
    .modal-buttons {
      margin-top: 1.5rem;
    }
    .modal-buttons button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: white;
      font-weight: 500;
    }
    .bg-green-600 {
      background-color: #16a34a;
    }
    .hover\\:bg-green-700:hover {
      background-color: #15803d;
    }
    .bg-red-500 {
      background-color: #ef4444;
    }
    .hover\\:bg-red-600:hover {
      background-color: #dc2626;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(modal);

  document.getElementById("confirmBtn").onclick = () => {
    modal.remove();
    onConfirm?.();
  };

  document.getElementById("closeBtn").onclick = () => {
    modal.remove();
    onCancel?.();
  };
}
