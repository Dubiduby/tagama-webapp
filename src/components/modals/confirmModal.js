export function showConfirmModal({
  message = "¿Estás seguro?",
  buttonText = "Confirmar",
  buttonColor = "green", // 'green' o 'red'
  onConfirm,
  onCancel,
}) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 z-50 flex items-center justify-center";

  const colorClass =
    buttonColor === "red"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-600 hover:bg-green-700";

  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-40"></div>

    <div class="relative bg-[var(--color-bg)] dark:bg-[var(--color-bg)] text-[var(--color-text)] max-w-sm w-[90%] p-6 rounded-2xl shadow-lg z-10 text-center">
      <button id="closeBtn" class="absolute top-3 right-3 text-[var(--color-text)] hover:text-[var(--color-title)] text-xl">&times;</button>
      <div class="text-[var(--color-title)] font-semibold text-lg mb-4">${message}</div>
      <div class="flex justify-center mt-4">
        <button
          id="confirmBtn"
          class="${colorClass} text-white font-semibold px-4 py-2 rounded-full transition-colors duration-300"
        >
          Sí, ${buttonText}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#confirmBtn").onclick = () => {
    modal.remove();
    onConfirm?.();
  };

  modal.querySelector("#closeBtn").onclick = () => {
    modal.remove();
    onCancel?.();
  };
}
